const API = '/api'

// if already logged in, redirect to dashboard
if (localStorage.getItem('token')) {
  // keep on non-root pages only if explicitly needed; otherwise go to dashboard
  if (location.pathname.endsWith('/login.html') || location.pathname.endsWith('/signup.html')) {
    window.location.href = '/'
  }
}

/* =======================
   LOGIN
======================= */
const loginForm = document.getElementById('loginForm')

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // pega os inputs corretamente
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
        return
      }

      // salva token
      localStorage.setItem('token', data.token)

      // redireciona para o sistema
      window.location.href = '/'

    } catch (err) {
      console.error(err)
      alert('Erro ao conectar com o servidor')
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

      // se o servidor retornou token, salvar e redirecionar ao dashboard
      if (data.token) {
        localStorage.setItem('token', data.token)
        window.location.href = '/'
        return
      }

      alert('Conta criada com sucesso!')
      window.location.href = '/login.html'

    } catch (err) {
      console.error(err)
      alert('Erro ao conectar com o servidor')
    }
  })
}
