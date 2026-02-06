# Autenticação Frontend - Firewall Wizard

## 📋 Alterações Implementadas no Frontend

### 1. **Página de Login** (`front/public/login.html`)
- ✅ Formulário de login funcional
- ✅ Validação de email e senha
- ✅ Integração com API `/api/login`
- ✅ Redirecionamento automático ao dashboard após login
- ✅ Token salvo no `localStorage`

### 2. **Página de Cadastro** (`front/public/signup.html`)
- ✅ Formulário de cadastro completo
- ✅ Campos: nome, email, senha
- ✅ Integração com API `/api/signup`
- ✅ Validações de senha (mínimo 6 caracteres)
- ✅ Link para voltar ao login

### 3. **Script de Autenticação** (`front/public/js/auth.js`)

#### Funcionalidades:
- **Proteção de Rotas**: Usuários sem token são redirecionados para `/login.html`
- **Auto-redirect**: Se estiver logado, não pode acessar login/signup
- **Login/Signup**: Processa formulários e faz requisições à API
- **Logout**: Função `logout()` que limpa token e redireciona
- **Storage**: Salva token e dados do usuário no localStorage

#### Funções Disponíveis:
```javascript
checkAuth()                    // Verifica se usuário está autenticado
logout()                       // Faz logout e limpa dados
fetchWithToken(url, options)   // Faz fetch com token Bearer
```

### 4. **Dashboard Principal** (`front/public/index.html`)

#### Novas Funcionalidades:
- ✅ Menu de usuário no rodapé da sidebar
- ✅ Exibe nome e email do usuário logado
- ✅ Botão "Sair" (Logout)
- ✅ Proteção de acesso (redireciona para login se não autenticado)
- ✅ Carrega dados do usuário do localStorage

#### Novo Layout da Sidebar:
```
[Logo]
[Links de Navegação]
[Espaço vazio]
┌─────────────────┐
│ João Silva      │
│ joao@email.com  │
│ [Sair]          │
└─────────────────┘
```

### 5. **Cliente API** (`front/public/js/api/apiClient.js`)

#### Melhorias:
- ✅ Token JWT incluído automaticamente em TODAS as requisições
- ✅ Header `Authorization: Bearer <token>` adicionado
- ✅ Detecção de token expirado (401)
- ✅ Redirecionamento automático para login se token expirar
- ✅ Funções: `postResource()`, `getResource()`, `putResource()`, `deleteResource()`

## 🔄 Fluxo de Autenticação

```
┌─────────────┐
│ login.html  │
└──────┬──────┘
       │ Submete credenciais
       ▼
┌──────────────────┐
│ POST /api/login  │
└──────┬───────────┘
       │ Retorna token + user
       ▼
┌─────────────────────────────┐
│ localStorage.setItem('token')│
│ localStorage.setItem('user') │
└──────┬──────────────────────┘
       │ Redireciona
       ▼
┌──────────────────┐
│ index.html       │ ◄── Dashboard protegido
│ (com menu user)  │
└──────────────────┘
```

## 📝 Dados Armazenados no localStorage

### Token:
```javascript
localStorage.getItem('token')
// Exemplo: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Dados do Usuário:
```javascript
localStorage.getItem('user')
// Exemplo: {"id":"uuid-123","name":"João Silva","email":"joao@email.com"}
```

## 🛡️ Proteção de Segurança

1. **Verificação de Token**: `checkAuth()` roda automaticamente ao carregar qualquer página
2. **Proteção de Rotas**: Páginas internas exigem token válido
3. **Token Expirado**: Cliente detecta 401 e redireciona para login
4. **CORS**: Configurado no backend para aceitar requisições do frontend
5. **Headers HTTP**: Token incluído como Bearer token no header Authorization

## 🚀 Como Usar

### 1. Primeiro Acesso
- Acesse http://localhost:3000
- Se não estiver logado, será redirecionado para `/login.html`
- Clique em "Criar conta" para ir para signup

### 2. Cadastro
- Preencha: Nome, Email, Senha (mín. 6 caracteres)
- Clique em "Cadastrar"
- Será automaticamente logado e redirecionado ao dashboard

### 3. Login
- Preencha: Email, Senha
- Clique em "Entrar"
- Será redirecionado ao dashboard com dados carregados

### 4. Usar o Sistema
- Acesse Tables, Chains, Rules, Logs
- Token é incluído automaticamente em todas as requisições
- Se o token expirar, será redirecionado para login

### 5. Logout
- Clique em "Sair" no menu de usuário (rodapé da sidebar)
- Será redirecionado para login
- Dados são limpos do localStorage

## 📱 Responsividade

- ✅ Menu de usuário visível em desktop
- ✅ Redireciona corretamente em mobile
- ✅ Interface adaptável

## ⚠️ Notas Importantes

1. **Token Duration**: 24 horas (configurável no backend)
2. **localStorage**: Dados persistem até fazer logout manual
3. **Private Pages**: Dashboard, Tables, Chains, Rules, Logs exigem autenticação
4. **CORS**: Certifique-se que o backend está permitindo requests do frontend
5. **Variáveis de Ambiente**: JWT_SECRET deve estar configurado no backend

## 🔧 Próximos Passos (Opcional)

- [ ] Adicionar "Lembrar de mim" (Remember Me)
- [ ] Implementar Refresh Token
- [ ] Adicionar 2FA (Autenticação de Dois Fatores)
- [ ] Página de perfil do usuário
- [ ] Recuperação de senha
- [ ] Confirmar email
- [ ] Darkmode toggle
