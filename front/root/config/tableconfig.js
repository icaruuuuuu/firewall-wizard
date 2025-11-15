// Form Handler para Table
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tableForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

// Validar formulário
function validateForm() {
    const errors = [];
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const family = document.getElementById('family').value;

    if (!name) {
        errors.push('Nome da tabela é obrigatório');
    } else if (name.includes(' ')) {
        errors.push('Nome da tabela não pode conter espaços');
    } else if (name.length < 3) {
        errors.push('Nome da tabela deve ter pelo menos 3 caracteres');
    }

    if (!description) {
        errors.push('Descrição é obrigatória');
    } else if (description.length < 10) {
        errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (!family) {
        errors.push('Família de protocolos é obrigatória');
    }

    return errors;
}

// Coletar dados do formulário
function collectFormData() {
    return {
        id: 't' + Date.now(),
        name: document.getElementById('name').value.trim(),
        family: document.getElementById('family').value,
        description: document.getElementById('description').value.trim()
    };
}

// Mostrar alerta
function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    
    if (type === 'error' && Array.isArray(message)) {
        alertBox.innerHTML = `
            <strong>❌ Erros na validação:</strong>
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

// Handle submit
function handleSubmit(e) {
    e.preventDefault();

    const errors = validateForm();

    if (errors.length > 0) {
        showAlert(errors, 'error');
        return;
    }

    const tableData = collectFormData();

    // Simular sucesso
    showAlert(`Tabla "${tableData.name}" creada exitosamente`);

    // Limpar formulário
    document.getElementById('tableForm').reset();

    // Redirecionar após sucesso
    setTimeout(() => {
        window.location.href = 'tablelist.html';
    }, 1500);
}

