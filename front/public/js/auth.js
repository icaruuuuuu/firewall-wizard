const API = '/api'

// Se não está logado e está tentando acessar página protegida, redireciona para login
function checkAuth() {
  const token = localStorage.getItem('token')
  const isAuthPage = location.pathname.endsWith('/login.html') || location.pathname.endsWith('/signup.html')

  // Se não tem token e não está na página de auth, vai para login
  if (!token && !isAuthPage) {
    window.location.href = '/login.html'
    return
  }

  // Se tem token e está na página de auth, vai para dashboard
  if (token && isAuthPage) {
    window.location.href = '/'
    return
  }
}

// Função auxiliar para fazer requisições com token
async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(url, { ...options, headers })
}

// Executar verificação de autenticação
checkAuth()

/* =======================
   LOGIN
======================= */
const loginForm = document.getElementById('loginForm')

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const submitBtn = loginForm.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    submitBtn.innerText = 'Entrando...'

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Erro ao fazer login')
        submitBtn.disabled = false
        submitBtn.innerText = 'Entrar'
        return
      }

      // Salva token e dados do usuário
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redireciona para o dashboard
      window.location.href = '/'

    } catch (err) {
      console.error(err)
      alert('Erro ao conectar com o servidor')
      submitBtn.disabled = false
      submitBtn.innerText = 'Entrar'
    }
  })
}

/* =======================
   CADASTRO
======================= */
const signupForm = document.getElementById('signupForm')

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    // Validações básicas
    if (password.length < 6) {
      alert('Senha deve ter pelo menos 6 caracteres')
      return
    }

    const submitBtn = signupForm.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    submitBtn.innerText = 'Criando...'

    try {
      const res = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Erro ao cadastrar usuário')
        submitBtn.disabled = false
        submitBtn.innerText = 'Cadastrar'
        return
      }

      // Se o servidor retornou token, salva e redireciona ao dashboard
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/'
        return
      }

      alert('Conta criada com sucesso!')
      window.location.href = '/login.html'

    } catch (err) {
      console.error(err)
      alert('Erro ao conectar com o servidor')
      submitBtn.disabled = false
      submitBtn.innerText = 'Cadastrar'
    }
  })
}

/* =======================
   LOGOUT
======================= */
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login.html'
}

// Expor função de logout globalmente
window.logout = logout
