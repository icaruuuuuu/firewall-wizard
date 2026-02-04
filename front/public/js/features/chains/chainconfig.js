import { postResource, getResource } from '../../api/apiClient.js';

document.addEventListener('DOMContentLoaded', () => {
  loadTables();
  setupEventListeners();
});

function setupEventListeners() {
  const form = document.getElementById('chainForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
}

async function loadTables() {
  try {
    const tables = await getResource('tables');
    populateTableSelect(tables);
  } catch (error) {
    console.error('Error loading tables:', error);
    showAlert('Error loading tables', 'error');
  }
}

function populateTableSelect(tables) {
  const tableSelect = document.getElementById('table');
  tableSelect.innerHTML = '<option value="">Select a table...</option>';

  if (Array.isArray(tables)) {
    tables.forEach(table => {
      const option = document.createElement('option');
      option.value = table.id;
      option.textContent = `${table.name} (${table.family})`;
      tableSelect.appendChild(option);
    });
  }
}

function validateForm() {
  const errors = [];
  const name = document.getElementById('name').value.trim();
  const table = document.getElementById('table').value;
  const type = document.getElementById('type').value;
  const hook = document.getElementById('hook').value;
  const priority = parseInt(document.getElementById('priority').value);

  if (!name) {
    errors.push('Chain name is required');
  }

  if (!table) {
    errors.push('Table is required');
  }

  if (!type) {
    errors.push('Type is required');
  }

  if (!hook) {
    errors.push('Hook is required');
  }

  if (isNaN(priority) || priority < -300 || priority > 300) {
    errors.push('Priority must be between -300 and 300');
  }

  return errors;
}

function collectFormData() {
  return {
    tableId: parseInt(document.getElementById('table').value),
    name: document.getElementById('name').value.trim(),
    description: document.getElementById('description').value.trim(),
    type: document.getElementById('type').value,
    hook: document.getElementById('hook').value,
    priority: parseInt(document.getElementById('priority').value),
    policy: document.getElementById('policy').value || 'accept'
  };
}

function showAlert(message, type = 'success') {
  const alertDiv = document.getElementById('alert');

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
    const chainData = collectFormData();
    await postResource('chains', chainData);

    showAlert(`Chain "${chainData.name}" created successfully`);
    document.getElementById('chainForm').reset();
  } catch (error) {
    showAlert(`Error creating chain: ${error.message}`, 'error');
  }
}

