// Mock Data - Tabelas do Firewall
const mockTables = [
    {
        id: 't1',
        name: 'filter',
        family: 'inet',
        description: 'Tabela principal de filtragem de pacotes - responsável pelo filtro de tráfego de entrada, saída e encaminhamento'
    },
    {
        id: 't2',
        name: 'nat',
        family: 'ip',
        description: 'Tabela para Network Address Translation - gerencia tradução de endereços de rede para redirecionamento de tráfego'
    },
    {
        id: 't3',
        name: 'mangle',
        family: 'inet',
        description: 'Tabela para modificação de pacotes - permite alterar campos de headers TCP/IP para QoS e roteamento avançado'
    },
    {
        id: 't4',
        name: 'raw',
        family: 'ip',
        description: 'Tabela raw para bypass de tracking - útil para conexões que precisam evitar rastreamento de estado'
    },
    {
        id: 't5',
        name: 'security',
        family: 'inet',
        description: 'Tabela de segurança - aplicações de políticas de segurança da aplicação após filtragem normal'
    }
];

let allTables = [];
let filteredTables = [];
let selectedTableForDelete = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
});

// Carregar dados
function loadData() {
    try {
        // Usar dados mock
        allTables = JSON.parse(JSON.stringify(mockTables));
        renderTables();
        updateStats();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showEmptyState();
    }
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const familyFilter = document.getElementById('familyFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    if (familyFilter) {
        familyFilter.addEventListener('change', applyFilters);
    }

    // Fechar modais ao clicar no backdrop
    document.getElementById('detailsModal').addEventListener('click', (e) => {
        if (e.target.id === 'detailsModal') {
            closeDetailsModal();
        }
    });

    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target.id === 'deleteModal') {
            closeDeleteModal();
        }
    });
}

// Aplicar filtros
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const familyFilter = document.getElementById('familyFilter').value;

    filteredTables = allTables.filter(table => {
        const matchSearch = 
            table.name.toLowerCase().includes(searchTerm) ||
            table.family.toLowerCase().includes(searchTerm) ||
            table.description.toLowerCase().includes(searchTerm);

        const matchFamily = familyFilter === '' || table.family === familyFilter;

        return matchSearch && matchFamily;
    });

    renderTables();
    updateStats();
}

// Resetar filtros
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('familyFilter').value = '';
    applyFilters();
}

// Renderizar tabelas
function renderTables() {
    const tbody = document.getElementById('tablesTableBody');
    
    if (!tbody) return;

    if (filteredTables.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">Nenhuma tabela encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = filteredTables.map(table => createTableRow(table)).join('');
}

// Criar linha de tabela
function createTableRow(table) {
    const familyBadge = {
        'inet': 'badge-inet',
        'ip': 'badge-ip',
        'ip6': 'badge-ip6'
    }[table.family] || 'badge-inet';

    return `
        <tr>
            <td style="font-weight: 600; color: #333;">${escapeHtml(table.name)}</td>
            <td>
                <span class="badge ${familyBadge}">
                    ${escapeHtml(table.family)}
                </span>
            </td>
            <td style="max-width: 300px; color: #666;">${escapeHtml(table.description.substring(0, 50))}...</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-ver" onclick="showDetailsModal('${table.id}')">Ver</button>
                    <button class="btn-action btn-del" onclick="showDeleteModal('${table.id}')">Del</button>
                </div>
            </td>
        </tr>
    `;
}

// Mostrar modal de detalhes
function showDetailsModal(tableId) {
    const table = allTables.find(t => t.id === tableId);
    
    if (!table) return;

    document.getElementById('detailId').textContent = table.id;
    document.getElementById('detailName').textContent = table.name;
    document.getElementById('detailFamily').textContent = table.family;
    document.getElementById('detailDescription').textContent = table.description;

    document.getElementById('detailsModal').classList.add('active');
}

// Fechar modal de detalhes
function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('active');
}

// Mostrar modal de confirmação de exclusão
function showDeleteModal(tableId) {
    const table = allTables.find(t => t.id === tableId);
    
    if (!table) return;

    selectedTableForDelete = tableId;
    document.getElementById('deleteTableName').textContent = table.name;
    document.getElementById('deleteModal').classList.add('active');
}

// Fechar modal de exclusão
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    selectedTableForDelete = null;
}

// Confirmar exclusão
function confirmDelete() {
    if (!selectedTableForDelete) return;

    allTables = allTables.filter(t => t.id !== selectedTableForDelete);
    filteredTables = filteredTables.filter(t => t.id !== selectedTableForDelete);
    
    closeDeleteModal();
    renderTables();
    updateStats();

    // Feedback visual
    showDeleteSuccess();
}

// Mostrar feedback de sucesso
function showDeleteSuccess() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = 'Tablea Eliminada com Sucesso!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Atualizar estatísticas
function updateStats() {
    const totalCount = allTables.length;
    const filteredCount = filteredTables.length;

    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('filteredCount').textContent = filteredCount;
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Mostrar estado vazio
function showEmptyState() {
    const tbody = document.getElementById('tablesTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px;">
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <div class="empty-state-text">Nenhuma tabela encontrada</div>
                        <div style="font-size: 12px; color: #bbb;">Verifique os filtros</div>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Inicializar dados
loadData();

