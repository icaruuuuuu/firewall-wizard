// ==================== VARIÁVEIS GLOBAIS ====================

console.log('✅ chainlistconfig.js carregado');

let allChains = [];
let allTables = [];
let filteredChains = [];

// ==================== ELEMENTOS DO DOM ====================

let searchInput, filterTable, filterType, btnReset, btnSearch;
let tableBody, emptyState, statsContainer;
let detailsModal, deleteModal;

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', async () => {
  initializeDOMElements();
  loadData();
  setupEventListeners();
  renderChains();
});

function initializeDOMElements() {
  searchInput = document.getElementById('searchInput');
  filterTable = document.getElementById('filterTable');
  filterType = document.getElementById('filterType');
  btnReset = document.getElementById('btnReset');
  btnSearch = document.getElementById('btnSearch');
  tableBody = document.getElementById('chainsTableBody');
  emptyState = document.getElementById('emptyState');
  statsContainer = document.getElementById('statsContainer');
  detailsModal = document.getElementById('detailsModal');
  deleteModal = document.getElementById('deleteModal');
}

// ==================== CARREGAMENTO DE DADOS ====================

function loadData() {
  allChains = getExampleChains();
  allTables = getExampleTables();
  filteredChains = [...allChains];
  
  populateTableFilter();
  updateStats();
}

// ==================== DADOS DE EXEMPLO ====================

function getExampleTables() {
  return [
    { id: 't1', name: 'filter', family: 'inet', description: 'Tabela principal de filtragem' },
    { id: 't2', name: 'nat', family: 'ip', description: 'Tabela para Network Address Translation' }
  ];
}

function getExampleChains() {
  return [
    {
      id: 'c1',
      table_id: 't1',
      name: 'input',
      type: 'filter',
      hook: 'input',
      priority: 0,
      policy: 'drop',
      description: 'Cadeia para tráfego de entrada no sistema'
    },
    {
      id: 'c2',
      table_id: 't1',
      name: 'forward',
      type: 'filter',
      hook: 'forward',
      priority: 0,
      policy: 'drop',
      description: 'Cadeia para tráfego sendo encaminhado'
    },
    {
      id: 'c3',
      table_id: 't1',
      name: 'output',
      type: 'filter',
      hook: 'output',
      priority: 0,
      policy: 'accept',
      description: 'Cadeia para tráfego de saída do sistema'
    },
    {
      id: 'c4',
      table_id: 't2',
      name: 'prerouting',
      type: 'nat',
      hook: 'prerouting',
      priority: -100,
      policy: null,
      description: 'Cadeia para NAT antes do roteamento'
    },
    {
      id: 'c5',
      table_id: 't2',
      name: 'postrouting',
      type: 'nat',
      hook: 'postrouting',
      priority: 100,
      policy: null,
      description: 'Cadeia para NAT depois do roteamento'
    }
  ];
}

// ==================== PREENCHIMENTO DE FILTROS ====================

function populateTableFilter() {
  filterTable.innerHTML = '<option value="">Todas as Tabelas</option>';
  allTables.forEach(table => {
    const option = document.createElement('option');
    option.value = table.id;
    option.textContent = `${table.name} (${table.family})`;
    filterTable.appendChild(option);
  });
}

// ==================== CONFIGURAÇÃO DE EVENT LISTENERS ====================

function setupEventListeners() {
  searchInput?.addEventListener('input', applyFilters);
  filterTable?.addEventListener('change', applyFilters);
  filterType?.addEventListener('change', applyFilters);
  btnReset?.addEventListener('click', resetFilters);
  btnSearch?.addEventListener('click', applyFilters);

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal').style.display = 'none';
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  
  btnCancelDelete?.addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });

  btnConfirmDelete?.addEventListener('click', () => {
    const chainId = deleteModal.getAttribute('data-chain-id');
    confirmDelete(chainId);
  });
}

// ==================== APLICAÇÃO DE FILTROS ====================

function applyFilters() {
  const searchTerm = (searchInput?.value || '').toLowerCase().trim();
  const tableFilter = filterTable?.value || '';
  const typeFilter = filterType?.value || '';

  filteredChains = allChains.filter(chain => {
    if (tableFilter && chain.table_id !== tableFilter) return false;
    if (typeFilter && chain.type !== typeFilter) return false;

    if (searchTerm) {
      const searchableText = `
        ${chain.name || ''}
        ${chain.description || ''}
        ${chain.hook || ''}
      `.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    return true;
  });

  renderChains();
  updateStats();
}

function resetFilters() {
  searchInput.value = '';
  filterTable.value = '';
  filterType.value = '';
  filteredChains = [...allChains];
  renderChains();
  updateStats();
}

// ==================== RENDERIZAÇÃO DA TABELA ====================

function renderChains() {
  if (!tableBody) return;

  if (filteredChains.length === 0) {
    tableBody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  tableBody.innerHTML = '';

  filteredChains.forEach(chain => {
    const row = createChainRow(chain);
    tableBody.appendChild(row);
  });
}

function createChainRow(chain) {
  const tr = document.createElement('tr');
  tr.id = `chain-${chain.id}`;

  const table = allTables.find(t => t.id === chain.table_id);
  const typeBadgeClass = `badge-type-${chain.type}`;
  const policyBadgeClass = chain.policy ? `badge-policy-${chain.policy}` : '';

  tr.innerHTML = `
    <td style="width: 100px;">
      <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${escapeHtml(chain.name)}</code>
    </td>
    <td>
      ${escapeHtml(chain.description || '-')}
    </td>
    <td style="width: 80px; text-align: center;">
      <span class="badge ${typeBadgeClass}">${chain.type.toUpperCase()}</span>
    </td>
    <td style="width: 80px; text-align: center;">
      ${escapeHtml(chain.hook)}
    </td>
    <td style="width: 80px; text-align: center;">
      ${escapeHtml(table?.name || '-')}
    </td>
    <td style="width: 80px; text-align: center;">
      ${chain.policy ? `<span class="badge ${policyBadgeClass}">${chain.policy.toUpperCase()}</span>` : '-'}
    </td>
    <td style="width: 80px; text-align: center;">
      ${chain.priority}
    </td>
    <td style="width: 150px; text-align: center;">
      <div class="action-buttons">
        <button class="btn-action btn-view" onclick="showDetailsModal('${chain.id}')">Ver</button>
        <button class="btn-action btn-delete" onclick="showDeleteModal('${chain.id}')">Del</button>
      </div>
    </td>
  `;

  return tr;
}

// ==================== MODAL DE DETALHES ====================

window.showDetailsModal = function(chainId) {
  const chain = allChains.find(c => c.id === chainId);
  if (!chain) return;

  const table = allTables.find(t => t.id === chain.table_id);

  const html = `
    <div class="modal-header">
      <h3>Detalhes da Chain</h3>
      <button class="modal-close" onclick="this.closest('.modal').style.display='none'">×</button>
    </div>
    <div class="modal-body">
      <div class="detail-section">
        <h4>Informações Gerais</h4>
        <table class="detail-table">
          <tr>
            <td class="detail-label">ID:</td>
            <td><code>${escapeHtml(chain.id)}</code></td>
          </tr>
          <tr>
            <td class="detail-label">Nome:</td>
            <td><code>${escapeHtml(chain.name)}</code></td>
          </tr>
          <tr>
            <td class="detail-label">Descrição:</td>
            <td>${escapeHtml(chain.description || '-')}</td>
          </tr>
          <tr>
            <td class="detail-label">Tipo:</td>
            <td><span class="badge badge-type-${chain.type}">${chain.type.toUpperCase()}</span></td>
          </tr>
        </table>
      </div>

      <div class="detail-section">
        <h4>Configuração</h4>
        <table class="detail-table">
          <tr>
            <td class="detail-label">Hook:</td>
            <td><code>${escapeHtml(chain.hook)}</code></td>
          </tr>
          <tr>
            <td class="detail-label">Prioridade:</td>
            <td><code>${chain.priority}</code></td>
          </tr>
          <tr>
            <td class="detail-label">Policy:</td>
            <td>${chain.policy ? `<span class="badge badge-policy-${chain.policy}">${chain.policy.toUpperCase()}</span>` : 'Nenhuma'}</td>
          </tr>
        </table>
      </div>

      <div class="detail-section">
        <h4>Localização</h4>
        <table class="detail-table">
          <tr>
            <td class="detail-label">Tabela:</td>
            <td><code>${escapeHtml(table?.name || '-')}</code> (${table?.family || 'inet'})</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  document.querySelector('#detailsModal .modal-content').innerHTML = html;
  detailsModal.style.display = 'flex';
};

// ==================== MODAL DE DELEÇÃO ====================

window.showDeleteModal = function(chainId) {
  const chain = allChains.find(c => c.id === chainId);
  if (!chain) return;

  deleteModal.setAttribute('data-chain-id', chainId);

  const html = `
    <div class="modal-header">
      <h3>Confirmar Deleção</h3>
      <button class="modal-close" onclick="this.closest('.modal').style.display='none'">×</button>
    </div>
    <div class="modal-body">
      <p><strong>Tem certeza que deseja deletar esta chain?</strong></p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
        <code>${escapeHtml(chain.name)}</code> - ${escapeHtml(chain.description || 'Sem descrição')}
      </p>
      <p style="color: #ef4444; font-size: 13px; margin-top: 10px;">
        ⚠️ Esta ação não pode ser desfeita!
      </p>
    </div>
    <div style="padding: 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px;">
      <button class="btn-secondary" id="btnCancelDelete">Cancelar</button>
      <button class="btn-action btn-delete" id="btnConfirmDelete">Deletar</button>
    </div>
  `;

  document.querySelector('#deleteModal .modal-content').innerHTML = html;

  document.getElementById('btnCancelDelete').addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });

  document.getElementById('btnConfirmDelete').addEventListener('click', () => {
    confirmDelete(chainId);
  });

  deleteModal.style.display = 'flex';
};

function confirmDelete(chainId) {
  allChains = allChains.filter(c => c.id !== chainId);
  filteredChains = filteredChains.filter(c => c.id !== chainId);
  deleteModal.style.display = 'none';
  renderChains();
  updateStats();
  console.log('Chain deletada com sucesso');
}

// ==================== ATUALIZAÇÃO DE ESTATÍSTICAS ====================

function updateStats() {
  if (!statsContainer) return;

  const total = filteredChains.length;
  const filter = filteredChains.filter(c => c.type === 'filter').length;
  const nat = filteredChains.filter(c => c.type === 'nat').length;
  const drop = filteredChains.filter(c => c.policy === 'drop').length;

  const statsHTML = `
    <div class="stat-card">
      <div class="stat-number">${total}</div>
      <div class="stat-label">Total</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${filter}</div>
      <div class="stat-label">Filter</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${nat}</div>
      <div class="stat-label">NAT</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${drop}</div>
      <div class="stat-label">Policy Drop</div>
    </div>
  `;

  statsContainer.innerHTML = statsHTML;
}

// ==================== UTILITÁRIOS ====================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

