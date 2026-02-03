const API = '/api'

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
