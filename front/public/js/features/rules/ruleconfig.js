import { postResource, getResource } from '../../api/apiClient.js';

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeForm);
} else {
  initializeForm();
}

function initializeForm() {
  console.log('Initializing rule form...');
  loadChains();
  setupEventListeners();
}

function setupEventListeners() {
  const form = document.getElementById('ruleForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  const matchTypeSelect = document.getElementById('matchType');
  if (matchTypeSelect) {
    matchTypeSelect.addEventListener('change', handleMatchTypeChange);
  }

  const statementSelect = document.getElementById('statement');
  if (statementSelect) {
    statementSelect.addEventListener('change', handleStatementChange);
  }
}

async function loadChains() {
  try {
    console.log('Starting to load chains...');
    const chains = await getResource('chains');
    console.log('Raw response from API:', chains);

    // Se a resposta for um objeto com propriedade 'chains', extrair o array
    let chainsArray = chains;
    if (chains && typeof chains === 'object' && !Array.isArray(chains)) {
      chainsArray = chains.chains || chains.data || Object.values(chains);
    }

    console.log('Chains array to populate:', chainsArray);
    populateChainSelect(chainsArray);
  } catch (error) {
    console.error('Error loading chains:', error);
    console.error('Error details:', error.message, error.status);
    showAlert(`Error loading chains: ${error.message}`, 'error');
  }
}

function populateChainSelect(chains) {
  const chainSelect = document.getElementById('chainId');
  if (!chainSelect) {
    console.error('Chain select element not found - looking for #chainId');
    console.log('Available elements:', document.querySelectorAll('select'));
    return;
  }

  console.log('Populating chain select with:', chains);
  chainSelect.innerHTML = '<option value="">Select Chain...</option>';

  if (Array.isArray(chains) && chains.length > 0) {
    chains.forEach(chain => {
      console.log('Adding chain option:', chain);
      const option = document.createElement('option');
      option.value = chain.id;
      option.textContent = `${chain.name} (${chain.type})`;
      chainSelect.appendChild(option);
    });
    console.log(`Populated ${chains.length} chains successfully`);
  } else if (Array.isArray(chains) && chains.length === 0) {
    console.warn('No chains found in database');
    const option = document.createElement('option');
    option.textContent = 'No chains available';
    option.disabled = true;
    chainSelect.appendChild(option);
  } else {
    console.warn('Chains is not an array or is null:', chains);
  }
}

function handleMatchTypeChange(e) {
  const selectedType = e.target.value;

  // Hide all match sections
  const matchSections = document.querySelectorAll('.match-section');
  matchSections.forEach(section => {
    section.style.display = 'none';
  });

  // Show selected section
  if (selectedType) {
    const section = document.getElementById(`match-${selectedType}`);
    if (section) {
      section.style.display = 'block';
    }
  }
}

function handleStatementChange(e) {
  const selectedStatement = e.target.value;

  // Hide all statement sections
  const statementSections = document.querySelectorAll('.statement-section');
  statementSections.forEach(section => {
    section.style.display = 'none';
  });

  // Show selected section
  if (selectedStatement) {
    const section = document.getElementById(`statement-${selectedStatement}`);
    if (section) {
      section.style.display = 'block';
    }
  }
}

function validateForm() {
  const errors = [];
  const description = document.getElementById('description').value.trim();
  const chainId = document.getElementById('chainId').value;
  const matchType = document.getElementById('matchType').value;
  const match = document.getElementById('match').value.trim();
  const statement = document.getElementById('statement').value;
  const expression = document.getElementById('expression').value.trim();

  if (!description) {
    errors.push('Description is required');
  }

  if (!chainId) {
    errors.push('Chain is required');
  }

  if (!matchType) {
    errors.push('Match type is required');
  }

  if (!match) {
    errors.push('Match expression is required');
  }

  if (!statement) {
    errors.push('Statement is required');
  }

  if (!expression) {
    errors.push('Expression is required (complete nftables rule)');
  }

  return errors;
}

function collectFormData() {
  const statement = document.getElementById('statement').value;
  const expression = document.getElementById('expression').value.trim();

  // If expression is empty, generate one from match and statement
  const finalExpression = expression || `${document.getElementById('match').value.trim()} ${statement}`;

  const formData = {
    chainId: parseInt(document.getElementById('chainId').value),
    description: document.getElementById('description').value.trim(),
    matchType: document.getElementById('matchType').value,
    match: document.getElementById('match').value.trim(),
    statement: statement,
    expression: finalExpression
  };

  // Add optional statement-specific fields
  if (statement === 'dnat' || statement === 'snat') {
    const natTarget = document.getElementById('natTarget').value.trim();
    if (natTarget) {
      formData.natTarget = natTarget;
    }
  }

  if (statement === 'log') {
    const logPrefix = document.getElementById('logPrefix').value.trim();
    const logLevel = document.getElementById('logLevel').value;
    formData.logConfig = {
      prefix: logPrefix || 'Firewall-Log: ',
      level: logLevel || 'info'
    };
  }

  console.log('Form data being sent:', formData);
  return formData;
}

function showAlert(message, type = 'success') {
  const alertDiv = document.querySelector('#ruleForm ~ .alert') || document.querySelector('.alert') || createAlertElement();

  if (type === 'error' && Array.isArray(message)) {
    alertDiv.innerHTML = `
      <strong>❌ Couldn't validate:</strong>
      <ul class="error-list">
        ${message.map(msg => `<li>${escapeHtml(msg)}</li>`).join('')}
      </ul>
    `;
  } else {
    alertDiv.textContent = type === 'success' ? '✓ ' + message : '❌ ' + message;
  }

  alertDiv.className = `alert ${type} active`;

  if (type === 'success') {
    setTimeout(() => {
      alertDiv.classList.remove('active');
    }, 2000);
  }
}

function createAlertElement() {
  const form = document.getElementById('ruleForm');
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert';
  form.parentNode.insertBefore(alertDiv, form.nextSibling);
  return alertDiv;
}

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

async function handleSubmit(e) {
  e.preventDefault();

  const errors = validateForm();
  if (errors.length > 0) {
    showAlert(errors, 'error');
    return;
  }

  try {
    const ruleData = collectFormData();
    await postResource('rules', ruleData);

    showAlert(`Rule "${ruleData.description}" created successfully`);
    document.getElementById('ruleForm').reset();
  } catch (error) {
    showAlert(`Error creating rule: ${error.message}`, 'error');
  }
}

