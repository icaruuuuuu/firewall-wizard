import { postResource } from '../../api/apiClient.js'

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tableForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

function validateForm() {
    const errors = [];
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const family = document.getElementById('family').value;

    if (!name) {
        errors.push('Table name is required');
    } else if (name.includes(' ')) {
        errors.push('Table name cannot contain whitespaces');
    } else if (name.length < 3) {
        errors.push('Table name must be atleast 3 characters');
    }

    if (!description) {
        errors.push('Description is required');
    } else if (description.length < 10) {
        errors.push('Description must be atleast 10 characters');
    }

    if (!family) {
        errors.push('Protocol family is required');
    }

    return errors;
}

// Coletar dados do formulário
function collectFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        description: document.getElementById('description').value.trim(),
        family: document.getElementById('family').value
    };
}

function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');

    if (type === 'error' && Array.isArray(message)) {
        alertBox.innerHTML = `
            <strong>❌ Couldn't validate:</strong>
            <ul class="error-list">
                ${message.map(msg => `<li>${escapeHtml(msg)}</li>`).join('')}
            </ul>
        `;
    } else {
        alertBox.textContent = type === 'success' ? '✓ ' + message : '❌ ' + message;
    }

    alertBox.className = `alert ${type} active`;

    if (type === 'success') {
        setTimeout(() => {
            alertBox.classList.remove('active');
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
        const tableData = collectFormData();
        await postResource('tables', tableData);

        showAlert(`Table "${tableData.name}" created successfully`);
        document.getElementById('tableForm').reset();
    } catch (error) {
        showAlert(`Error creating table: ${error.message}`, 'error');
    }
}

