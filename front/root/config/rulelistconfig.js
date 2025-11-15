// ==================== VARIÁVEIS GLOBAIS ====================

console.log('✅ rulelistconfig.js carregado');

let allRules = [];
let allChains = [];
let allTables = [];
let filteredRules = [];

// ==================== ELEMENTOS DO DOM ====================

let searchInput, filterTable, filterChain, filterAction, btnReset, btnSearch;
let tableBody, emptyState, statsContainer;
let detailsModal, deleteModal;
let detailsModalContent, deleteModalContent;

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', async () => {
  initializeDOMElements();
  await loadData();
  setupEventListeners();
  renderRules();
});

function initializeDOMElements() {
  searchInput = document.getElementById('searchInput');
  filterTable = document.getElementById('filterTable');
  filterChain = document.getElementById('filterChain');
  filterAction = document.getElementById('filterAction');
  btnReset = document.getElementById('btnReset');
  btnSearch = document.getElementById('btnSearch');
  tableBody = document.getElementById('rulesTableBody');
  emptyState = document.getElementById('emptyState');
  statsContainer = document.getElementById('statsContainer');
  detailsModal = document.getElementById('detailsModal');
  deleteModal = document.getElementById('deleteModal');
  detailsModalContent = document.querySelector('#detailsModal .modal-content');
  deleteModalContent = document.querySelector('#deleteModal .modal-content');
}

// ==================== CARREGAMENTO DE DADOS ====================

async function loadData() {
  try {
    console.log('Carregando dados locais...');
    
    allRules = getExampleRules();
    allChains = getExampleChains();
    allTables = getExampleTables();

    console.log('Dados carregados:', allRules.length, 'regras');

    filteredRules = [...allRules];
    populateChainFilter();
    populateTableFilter();
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

// ==================== DADOS DE EXEMPLO (FALLBACK) ====================

function getExampleTables() {
  return [
    { id: 't1', name: 'filter', family: 'inet' },
    { id: 't2', name: 'nat', family: 'ip' }
  ];
}

function getExampleChains() {
  return [
    { id: 'c1', table_id: 't1', name: 'input', hook: 'input', policy: 'drop' },
    { id: 'c2', table_id: 't1', name: 'forward', hook: 'forward', policy: 'drop' },
    { id: 'c3', table_id: 't1', name: 'output', hook: 'output', policy: 'accept' },
    { id: 'c4', table_id: 't2', name: 'prerouting', hook: 'prerouting', policy: null },
    { id: 'c5', table_id: 't2', name: 'postrouting', hook: 'postrouting', policy: null }
  ];
}

function getExampleRules() {
  return [
    {
      id: 'r1',
      chain_id: 'c1',
      position: 1,
      description: 'Permitir interface loopback',
      matches: [{ type: 'interface', interface: 'lo', direction: 'input' }],
      action: 'accept',
      counter: true,
      enabled: true
    },
    {
      id: 'r2',
      chain_id: 'c1',
      position: 2,
      description: 'Permitir conexões estabelecidas e relacionadas',
      matches: [{ type: 'state', states: ['established', 'related'] }],
      action: 'accept',
      counter: true,
      enabled: true
    },
    {
      id: 'r3',
      chain_id: 'c1',
      position: 3,
      description: 'SSH apenas de redes administrativas com rate limiting',
      matches: [
        { type: 'protocol', protocol: 'tcp', destination_port: 22 },
        { type: 'ip', source_address: '@admin_networks' },
        { type: 'limit', rate: '5/minute', burst: 10 }
      ],
      action: 'accept',
      counter: true,
      enabled: true
    },
    {
      id: 'r4',
      chain_id: 'c1',
      position: 4,
      description: 'Serviços web nas portas padrão',
      matches: [
        { type: 'protocol', protocol: 'tcp', destination_port: '@web_ports' }
      ],
      action: 'accept',
      counter: true,
      enabled: true
    },
    {
      id: 'r5',
      chain_id: 'c1',
      position: 5,
      description: 'Proteção contra ICMP flood',
      matches: [
        { type: 'protocol', protocol: 'icmp' },
        { type: 'limit', rate: '2/second', burst: 5 }
      ],
      action: 'accept',
      enabled: true
    },
    {
      id: 'r6',
      chain_id: 'c1',
      position: 6,
      description: 'Bloquear IPs com excesso de tentativas SSH',
      matches: [{ type: 'ip', source_address: '@ssh_abusers' }],
      action: 'drop',
      enabled: true
    },
    {
      id: 'r9',
      chain_id: 'c4',
      position: 1,
      description: 'Redirecionar HTTP para servidor interno',
      matches: [
        { type: 'protocol', protocol: 'tcp', destination_port: 80 }
      ],
      action: 'dnat',
      nat_target: '192.168.1.100:8080',
      enabled: true
    },
    {
      id: 'r10',
      chain_id: 'c5',
      position: 1,
      description: 'NAT para tráfego de saída na internet',
      matches: [{ type: 'interface', interface: 'eth0', direction: 'output' }],
      action: 'masquerade',
      enabled: true
    }
  ];
}

// ==================== PREENCHIMENTO DE FILTROS ====================

function populateTableFilter() {
  filterTable.innerHTML = '<option value="">Todas as Tables</option>';
  allTables.forEach(table => {
    const option = document.createElement('option');
    option.value = table.id;
    option.textContent = `${table.name} (${table.family})`;
    filterTable.appendChild(option);
  });
}

function populateChainFilter() {
  filterChain.innerHTML = '<option value="">Todas as Chains</option>';
  allChains.forEach(chain => {
    const table = allTables.find(t => t.id === chain.table_id);
    const tableName = table ? table.name : 'unknown';
    const option = document.createElement('option');
    option.value = chain.id;
    option.textContent = `${chain.name} (${tableName})`;
    filterChain.appendChild(option);
  });
}

// ==================== CONFIGURAÇÃO DE EVENT LISTENERS ====================

function setupEventListeners() {
  searchInput?.addEventListener('input', applyFilters);
  filterTable?.addEventListener('change', applyFilters);
  filterChain?.addEventListener('change', applyFilters);
  filterAction?.addEventListener('change', applyFilters);
  btnReset?.addEventListener('click', resetFilters);
  btnSearch?.addEventListener('click', applyFilters);

  // Modal - fechar ao clicar no X
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal').style.display = 'none';
    });
  });

  // Modal - fechar ao clicar fora
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Modal delete - botões
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  
  btnCancelDelete?.addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });

  btnConfirmDelete?.addEventListener('click', () => {
    const ruleId = deleteModal.getAttribute('data-rule-id');
    confirmDelete(ruleId);
  });
}

// ==================== APLICAÇÃO DE FILTROS ====================

function applyFilters() {
  const searchTerm = (searchInput?.value || '').toLowerCase().trim();
  const tableFilter = filterTable?.value || '';
  const chainFilter = filterChain?.value || '';
  const actionFilter = filterAction?.value || '';

  filteredRules = allRules.filter(rule => {
    const chain = allChains.find(c => c.id === rule.chain_id);
    
    // Filtro de tabela
    if (tableFilter && chain?.table_id !== tableFilter) return false;

    // Filtro de chain
    if (chainFilter && rule.chain_id !== chainFilter) return false;

    // Filtro de action
    if (actionFilter && rule.action !== actionFilter) return false;

    // Filtro de busca
    if (searchTerm) {
      const searchableText = `
        ${rule.description || ''}
        ${rule.action || ''}
        ${rule.id || ''}
      `.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    return true;
  });

  renderRules();
  updateStats();
}

function resetFilters() {
  searchInput.value = '';
  filterTable.value = '';
  filterChain.value = '';
  filterAction.value = '';
  filteredRules = [...allRules];
  renderRules();
  updateStats();
}

// ==================== RENDERIZAÇÃO DA TABELA ====================

function renderRules() {
  if (!tableBody) return;

  if (filteredRules.length === 0) {
    tableBody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  tableBody.innerHTML = '';

  filteredRules.sort((a, b) => a.position - b.position).forEach(rule => {
    const row = createRuleRow(rule);
    tableBody.appendChild(row);
  });
}

function createRuleRow(rule) {
  const tr = document.createElement('tr');
  tr.className = rule.enabled ? '' : 'rule-inactive';
  tr.id = `rule-${rule.id}`;

  const chain = allChains.find(c => c.id === rule.chain_id);
  const table = allTables.find(t => t.id === chain?.table_id);

  const statusClass = rule.enabled ? 'status-active' : 'status-inactive';
  const actionBadgeClass = `badge-action-${rule.action}`;
  const familyBadgeClass = `badge-family-${table?.family || 'inet'}`;

  tr.innerHTML = `
    <td style="width: 30px; text-align: center;">
      <span class="status-indicator ${statusClass}"></span>
    </td>
    <td style="flex: 1; min-width: 200px;">
      ${escapeHtml(rule.description || 'Sem descrição')}
    </td>
    <td style="width: 80px; text-align: center;">
      <span class="badge ${familyBadgeClass}">${table?.family || 'inet'}</span>
    </td>
    <td style="width: 80px; text-align: center;">
      ${escapeHtml(table?.name || '-')}
    </td>
    <td style="width: 100px; text-align: center;">
      ${escapeHtml(chain?.name || '-')}
    </td>
    <td style="width: 100px; text-align: center;">
      <span class="badge ${actionBadgeClass}">${rule.action.toUpperCase()}</span>
    </td>
    <td style="width: 60px; text-align: center;">
      ${rule.position}
    </td>
    <td style="width: 80px; text-align: center;">
      ${rule.counter ? escapeHtml(String(rule.counter)) : '-'}
    </td>
    <td style="width: 150px; text-align: center;">
      <div class="action-buttons">
        <button class="btn-action btn-view" onclick="showDetailsModal('${rule.id}')">Ver</button>
        <button class="btn-action btn-toggle" onclick="toggleRule('${rule.id}')">
          ${rule.enabled ? 'Ativar' : 'Desativar'}
        </button>
        <button class="btn-action btn-delete" onclick="showDeleteModal('${rule.id}')">Del</button>
      </div>
    </td>
  `;

  return tr;
}

// ==================== MODAL DE DETALHES ====================

window.showDetailsModal = function(ruleId) {
  const rule = allRules.find(r => r.id === ruleId);
  if (!rule) return;

  const chain = allChains.find(c => c.id === rule.chain_id);
  const table = allTables.find(t => t.id === chain?.table_id);

  let matchesHTML = '';
  if (rule.matches && rule.matches.length > 0) {
    matchesHTML = `
      <div class="detail-section">
        <h4>Correspondências (Matches)</h4>
        <div class="detail-matches">
          ${rule.matches.map(m => formatMatch(m)).join('<br><br>')}
        </div>
      </div>
    `;
  }

  let actionHTML = `<code>${rule.action.toUpperCase()}</code>`;
  
  if (rule.nat_target) {
    actionHTML += ` → <code>${escapeHtml(rule.nat_target)}</code>`;
  }
  if (rule.set_target) {
    actionHTML += ` → <code>${escapeHtml(rule.set_target)}</code>`;
  }

  const html = `
    <div class="modal-header">
      <h3>Detalhes da Regra</h3>
      <button class="modal-close" onclick="this.closest('.modal').style.display='none'">×</button>
    </div>
    <div class="modal-body">
      <div class="detail-section">
        <h4>Informações Gerais</h4>
        <table class="detail-table">
          <tr>
            <td class="detail-label">ID:</td>
            <td><code>${escapeHtml(rule.id)}</code></td>
          </tr>
          <tr>
            <td class="detail-label">Descrição:</td>
            <td>${escapeHtml(rule.description || '-')}</td>
          </tr>
          <tr>
            <td class="detail-label">Status:</td>
            <td>
              <span class="badge ${rule.enabled ? 'badge-action-accept' : 'badge-action-drop'}">
                ${rule.enabled ? 'ATIVO' : 'INATIVO'}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <div class="detail-section">
        <h4>Localização</h4>
        <table class="detail-table">
          <tr>
            <td class="detail-label">Table:</td>
            <td><code>${escapeHtml(table?.name || '-')}</code> (${table?.family || 'inet'})</td>
          </tr>
          <tr>
            <td class="detail-label">Chain:</td>
            <td><code>${escapeHtml(chain?.name || '-')}</code></td>
          </tr>
          <tr>
            <td class="detail-label">Posição:</td>
            <td>${rule.position}</td>
          </tr>
        </table>
      </div>

      ${matchesHTML}

      <div class="detail-section">
        <h4>Ação</h4>
        <table class="detail-table">
          <tr>
            <td class="detail-label">Tipo:</td>
            <td>${actionHTML}</td>
          </tr>
          ${rule.log_config ? `
            <tr>
              <td class="detail-label">Log:</td>
              <td>
                Prefix: <code>${escapeHtml(rule.log_config.prefix || '-')}</code><br>
                Level: <code>${escapeHtml(rule.log_config.level || '-')}</code>
              </td>
            </tr>
          ` : ''}
        </table>
      </div>

      ${rule.comment ? `
        <div class="detail-section">
          <h4>Comentário</h4>
          <p>${escapeHtml(rule.comment)}</p>
        </div>
      ` : ''}
    </div>
  `;

  detailsModalContent.innerHTML = html;
  detailsModal.style.display = 'flex';
};

function formatMatch(match) {
  let text = `<strong>${match.type.toUpperCase()}</strong>: `;
  
  switch (match.type) {
    case 'interface':
      text += `${match.interface} (${match.direction || 'ambas'})`;
      break;
    case 'state':
      text += (match.states || []).join(', ');
      break;
    case 'protocol':
      text += `${match.protocol}`;
      if (match.destination_port) text += ` porta ${match.destination_port}`;
      if (match.source_port) text += ` origem ${match.source_port}`;
      break;
    case 'ip':
      if (match.source_address) text += `origem: ${match.source_address} `;
      if (match.destination_address) text += `destino: ${match.destination_address}`;
      break;
    case 'limit':
      text += `${match.rate}${match.burst ? ` (burst: ${match.burst})` : ''}`;
      break;
    default:
      text += JSON.stringify(match);
  }
  
  return text;
}

// ==================== TOGGLE DE REGRA ====================

window.toggleRule = function(ruleId) {
  const rule = allRules.find(r => r.id === ruleId);
  if (!rule) return;

  rule.enabled = !rule.enabled;

  // Atualizar UI localmente
  const row = document.getElementById(`rule-${ruleId}`);
  if (row) {
    row.classList.toggle('rule-inactive');
  }
  
  updateStats();
};

// ==================== MODAL DE DELEÇÃO ====================

window.showDeleteModal = function(ruleId) {
  const rule = allRules.find(r => r.id === ruleId);
  if (!rule) return;

  deleteModal.setAttribute('data-rule-id', ruleId);

  const html = `
    <div class="modal-header">
      <h3>Confirmar Deleção</h3>
      <button class="modal-close" onclick="this.closest('.modal').style.display='none'">×</button>
    </div>
    <div class="modal-body">
      <p><strong>Tem certeza que deseja deletar esta regra?</strong></p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
        ${escapeHtml(rule.description || 'Sem descrição')}
      </p>
      <p class="text-warning">
        ⚠️ Esta ação não pode ser desfeita!
      </p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" id="btnCancelDelete">Cancelar</button>
      <button class="btn-danger" id="btnConfirmDelete">Deletar</button>
    </div>
  `;

  deleteModalContent.innerHTML = html;

  // Rebind event listeners
  document.getElementById('btnCancelDelete').addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });

  document.getElementById('btnConfirmDelete').addEventListener('click', () => {
    confirmDelete(ruleId);
  });

  deleteModal.style.display = 'flex';
};

async function confirmDelete(ruleId) {
  allRules = allRules.filter(r => r.id !== ruleId);
  filteredRules = filteredRules.filter(r => r.id !== ruleId);
  deleteModal.style.display = 'none';
  renderRules();
  updateStats();
  console.log('Regra deletada com sucesso');
}

// ==================== ATUALIZAÇÃO DE ESTATÍSTICAS ====================

function updateStats() {
  if (!statsContainer) return;

  const total = filteredRules.length;
  const active = filteredRules.filter(r => r.enabled).length;
  const inactive = total - active;
  const accept = filteredRules.filter(r => r.action === 'accept').length;
  const drop = filteredRules.filter(r => r.action === 'drop').length;

  const statsHTML = `
    <div class="stat-card">
      <div class="stat-number">${total}</div>
      <div class="stat-label">Total</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${active}</div>
      <div class="stat-label">Ativas</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${inactive}</div>
      <div class="stat-label">Inativas</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${accept}</div>
      <div class="stat-label">Accept</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${drop}</div>
      <div class="stat-label">Drop</div>
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

// ==================== NAVEGAÇÃO ====================

window.goToNewRule = function() {
  window.location.href = '/config/rule.html';
};

window.goHome = function() {
  window.location.href = '/index.html';
};

