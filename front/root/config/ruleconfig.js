// ==================== ELEMENTOS DO DOM ====================
const ruleForm = document.getElementById('ruleForm');
const matchTypeSelect = document.getElementById('matchType');
const actionSelect = document.getElementById('action');

// Seções de correspondência
const matchSections = {
  interface: document.getElementById('match-interface'),
  state: document.getElementById('match-state'),
  protocol: document.getElementById('match-protocol'),
  ip: document.getElementById('match-ip'),
  limit: document.getElementById('match-limit'),
};

// Seções de ação
const actionSections = {
  dnat: document.getElementById('action-dnat'),
  log: document.getElementById('action-log'),
  set: document.getElementById('action-set'),
};

// ==================== DADOS MOCKADOS ====================

// Dados de exemplo (sem backend)
const mockTables = [
  { id: 't1', name: 'filter', family: 'inet', description: 'Filtragem de pacotes' },
  { id: 't2', name: 'nat', family: 'ip', description: 'Network Address Translation' },
  { id: 't3', name: 'mangle', family: 'inet', description: 'Modificação de pacotes' },
];

const mockChains = [
  { id: 'c1', table_id: 't1', name: 'input', type: 'filter', hook: 'input' },
  { id: 'c2', table_id: 't1', name: 'forward', type: 'filter', hook: 'forward' },
  { id: 'c3', table_id: 't1', name: 'output', type: 'filter', hook: 'output' },
  { id: 'c4', table_id: 't2', name: 'prerouting', type: 'nat', hook: 'prerouting' },
  { id: 'c5', table_id: 't2', name: 'postrouting', type: 'nat', hook: 'postrouting' },
];

// ==================== GERENCIAMENTO DE SEÇÕES ====================

/**
 * Mostra/oculta as seções de correspondência com base no tipo selecionado
 */
matchTypeSelect.addEventListener('change', (e) => {
  const selectedType = e.target.value;
  
  // Oculta todas as seções
  Object.values(matchSections).forEach(section => {
    if (section) section.style.display = 'none';
  });
  
  // Mostra a seção selecionada
  if (selectedType && matchSections[selectedType]) {
    matchSections[selectedType].style.display = 'block';
  }
});

/**
 * Mostra/oculta as seções de ação com base na ação selecionada
 */
actionSelect.addEventListener('change', (e) => {
  const selectedAction = e.target.value;
  
  // Oculta todas as seções
  Object.values(actionSections).forEach(section => {
    if (section) section.style.display = 'none';
  });
  
  // Mostra a seção apropriada
  if (selectedAction === 'dnat' || selectedAction === 'snat') {
    actionSections.dnat.style.display = 'block';
  } else if (selectedAction === 'log') {
    actionSections.log.style.display = 'block';
  } else if (selectedAction === 'add_to_set') {
    actionSections.set.style.display = 'block';
  }
});

// ==================== VALIDAÇÃO E SUBMISSÃO ====================

/**
 * Coleta os dados do formulário
 */
function collectFormData() {
  const formData = {
    id: 'r' + Math.random().toString(36).substr(2, 9),
    description: document.getElementById('description').value,
    family: document.getElementById('family').value,
    table_id: document.getElementById('table').value,
    chain_id: document.getElementById('chain').value,
    position: parseInt(document.getElementById('position').value) || 1,
    enabled: document.getElementById('enabled').checked,
    counter: document.getElementById('counter').checked,
    comment: document.getElementById('comment').value,
    
    matches: collectMatches(),
    action: document.getElementById('action').value,
    log_config: collectLogConfig(),
  };
  
  // Adiciona campos opcionais baseados na ação
  if (formData.action === 'dnat' || formData.action === 'snat') {
    formData.nat_target = document.getElementById('natTarget').value;
  }
  
  if (formData.action === 'add_to_set') {
    formData.set_target = document.getElementById('setTarget').value;
  }
  
  return formData;
}

/**
 * Coleta os critérios de correspondência
 */
function collectMatches() {
  const matches = [];
  const matchType = document.getElementById('matchType').value;
  
  switch (matchType) {
    case 'interface':
      if (document.getElementById('interface').value) {
        matches.push({
          type: 'interface',
          interface: document.getElementById('interface').value,
          direction: document.getElementById('interfaceDir').value,
        });
      }
      break;
      
    case 'state':
      const selectedStates = Array.from(
        document.querySelectorAll('input[name="states"]:checked')
      ).map(cb => cb.value);
      
      if (selectedStates.length > 0) {
        matches.push({
          type: 'state',
          states: selectedStates,
        });
      }
      break;
      
    case 'protocol':
      if (document.getElementById('protocol').value) {
        matches.push({
          type: 'protocol',
          protocol: document.getElementById('protocol').value,
          destination_port: document.getElementById('destPort').value || undefined,
          source_port: document.getElementById('srcPort').value || undefined,
        });
      }
      break;
      
    case 'ip':
      if (document.getElementById('srcAddr').value || document.getElementById('destAddr').value) {
        matches.push({
          type: 'ip',
          source_address: document.getElementById('srcAddr').value || undefined,
          destination_address: document.getElementById('destAddr').value || undefined,
        });
      }
      break;
      
    case 'limit':
      if (document.getElementById('rate').value) {
        matches.push({
          type: 'limit',
          rate: document.getElementById('rate').value,
          burst: parseInt(document.getElementById('burst').value) || 10,
        });
      }
      break;
      
    case 'all':
      matches.push({ type: 'all' });
      break;
  }
  
  return matches;
}

/**
 * Coleta a configuração de log se aplicável
 */
function collectLogConfig() {
  const action = document.getElementById('action').value;
  
  if (action === 'log') {
    return {
      prefix: document.getElementById('logPrefix').value || 'Firewall-Log: ',
      level: document.getElementById('logLevel').value || 'info',
    };
  }
  
  return null;
}

/**
 * Valida o formulário
 */
function validateForm() {
  const errors = [];
  
  if (!document.getElementById('description').value.trim()) {
    errors.push('Descrição é obrigatória');
  }
  
  if (!document.getElementById('family').value) {
    errors.push('Family é obrigatório');
  }
  
  if (!document.getElementById('table').value) {
    errors.push('Tabela é obrigatória');
  }
  
  if (!document.getElementById('chain').value) {
    errors.push('Chain é obrigatório');
  }
  
  if (!document.getElementById('matchType').value) {
    errors.push('Tipo de correspondência é obrigatório');
  }
  
  if (!document.getElementById('action').value) {
    errors.push('Ação é obrigatória');
  }
  
  return errors;
}

/**
 * Mostra mensagens de erro
 */
function showErrors(errors) {
  const errorMessage = errors.join('\n');
  alert(`Erros no formulário:\n\n${errorMessage}`);
}

/**
 * Submete o formulário
 */
ruleForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Apenas modo visual - sem funcionalidade real
  alert('⚠️ Formulário em modo visual apenas. Funcionalidade desabilitada.');
});

// ==================== PREENCHIMENTO DE DROPDOWNS DINÂMICOS ====================

/**
 * Carrega as tabelas disponíveis
 */
function loadTables() {
  const tableSelect = document.getElementById('table');
  
  mockTables.forEach(table => {
    const option = document.createElement('option');
    option.value = table.id;
    option.textContent = `${table.name} (${table.family})`;
    tableSelect.appendChild(option);
  });
}

/**
 * Carrega as chains disponíveis
 */
function loadChains() {
  const chainSelect = document.getElementById('chain');
  
  mockChains.forEach(chain => {
    const option = document.createElement('option');
    option.value = chain.id;
    option.textContent = `${chain.name} (${chain.type})`;
    chainSelect.appendChild(option);
  });
}

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
  loadTables();
  loadChains();
  
  // Inicializa as seções como ocultas
  Object.values(matchSections).forEach(section => {
    if (section) section.style.display = 'none';
  });
  
  Object.values(actionSections).forEach(section => {
    if (section) section.style.display = 'none';
  });
  
  console.log('Página de configuração de regras carregada');
});

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Reseta o formulário e suas seções
 */
ruleForm.addEventListener('reset', () => {
  setTimeout(() => {
    // Oculta todas as seções após reset
    Object.values(matchSections).forEach(section => {
      if (section) section.style.display = 'none';
    });
    
    Object.values(actionSections).forEach(section => {
      if (section) section.style.display = 'none';
    });
  }, 0);
});

