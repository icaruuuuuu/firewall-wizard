// ==================== VARIÁVEIS GLOBAIS ====================

console.log('✅ chainconfig.js carregado');

let allTables = [];

// ==================== ELEMENTOS DO DOM ====================

const form = document.getElementById('chainForm');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const tableSelect = document.getElementById('table');
const typeSelect = document.getElementById('type');
const hookSelect = document.getElementById('hook');
const priorityInput = document.getElementById('priority');
const policySelect = document.getElementById('policy');
const alertDiv = document.getElementById('alert');

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
  loadTables();
  setupEventListeners();
});

function setupEventListeners() {
  form?.addEventListener('submit', handleSubmit);
}

// ==================== CARREGAMENTO DE DADOS ====================

function loadTables() {
  allTables = getExampleTables();
  populateTableSelect();
}

function getExampleTables() {
  return [
    { id: 't1', name: 'filter', family: 'inet', description: 'Tabela principal de filtragem' },
    { id: 't2', name: 'nat', family: 'ip', description: 'Tabela para Network Address Translation' }
  ];
}

function populateTableSelect() {
  tableSelect.innerHTML = '<option value="">Selecione uma tabela...</option>';
  allTables.forEach(table => {
    const option = document.createElement('option');
    option.value = table.id;
    option.textContent = `${table.name} (${table.family})`;
    tableSelect.appendChild(option);
  });
}

// ==================== VALIDAÇÃO ====================

function validateForm() {
  const errors = [];

  if (!nameInput.value.trim()) {
    errors.push('Nome da chain é obrigatório');
  }

  if (!tableSelect.value) {
    errors.push('Tabela é obrigatória');
  }

  if (!typeSelect.value) {
    errors.push('Tipo é obrigatório');
  }

  if (!hookSelect.value) {
    errors.push('Hook é obrigatório');
  }

  const priority = parseInt(priorityInput.value);
  if (isNaN(priority) || priority < -300 || priority > 300) {
    errors.push('Prioridade deve estar entre -300 e 300');
  }

  return errors;
}

// ==================== COLETA DE DADOS ====================

function collectFormData() {
  return {
    id: `c${Date.now()}`,
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    table_id: tableSelect.value,
    type: typeSelect.value,
    hook: hookSelect.value,
    priority: parseInt(priorityInput.value),
    policy: policySelect.value || null
  };
}

// ==================== TRATAMENTO DE ENVIO ====================

function handleSubmit(e) {
  e.preventDefault();

  // Validar
  const errors = validateForm();
  if (errors.length > 0) {
    showAlert(errors.join('<br>'), 'error');
    return;
  }

  // Coletar dados
  const chainData = collectFormData();

  // Simular salvamento
  console.log('Chain para ser criada:', chainData);
  
  showAlert('✓ Chain criada com sucesso! Redirecionando...', 'success');
  
  setTimeout(() => {
    window.location.href = 'chainlist.html';
  }, 1500);
}

// ==================== MENSAGENS ====================

function showAlert(message, type) {
  alertDiv.className = `alert alert-${type}`;
  alertDiv.innerHTML = message;
  alertDiv.style.display = 'block';
  
  setTimeout(() => {
    alertDiv.style.display = 'none';
  }, 5000);
}

