# Autenticação com JWT - Firewall Wizard

## Resumo da Implementação

O sistema de autenticação foi implementado usando **JSON Web Token (JWT)** com as seguintes funcionalidades:

### ✅ Recursos Implementados

1. **Cadastro de Usuário (Signup)**
   - Endpoint: `POST /api/signup`
   - Validações: Email, senha mínima (6 caracteres), verificação de duplicação
   - Retorna: Token JWT e dados do usuário

2. **Login de Usuário**
   - Endpoint: `POST /api/login`
   - Validações: Credenciais de email/senha com hash bcrypt
   - Retorna: Token JWT e dados do usuário

3. **Middleware de Proteção**
   - Arquivo: `back/src/middlewares/auth.js`
   - Função: `isAuthenticated()`
   - Validações: Token Bearer format, expiração, assinatura

4. **Rotas Protegidas - Tables**
   - Todas as rotas de `/tables` agora exigem token JWT válido
   - Métodos protegidos: GET, POST, PUT, DELETE

## Configuração Necessária

Certifique-se de ter a variável de ambiente configurada no arquivo `.env`:

```env
JWT_SECRET=sua-chave-secreta-aqui
```

## Como Usar

### 1. Cadastrar um novo usuário

```bash
POST /api/signup
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123456"
}
```

**Resposta (201 Created):**
```json
{
  "message": "Usuário cadastrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### 2. Fazer login

```bash
POST /api/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123456"
}
```

**Resposta (200 OK):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### 3. Usar o token para acessar rotas protegidas (Tables)

```bash
GET /api/tables
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "filter",
    "family": "ip6",
    "description": "Tabela principal de filtragem"
  }
]
```

## Tratamento de Erros

### Token Ausente
```
Status: 401
{
  "error": "Token não fornecido"
}
```

### Token Inválido
```
Status: 401
{
  "error": "Token inválido ou expirado"
}
```

### Credenciais Inválidas
```
Status: 401
{
  "error": "Usuário ou senha inválidos"
}
```

### Email Duplicado
```
Status: 400
{
  "error": "Usuário já cadastrado com este email"
}
```

## Estrutura de Implementação

### Middleware (`back/src/middlewares/auth.js`)
- Função `isAuthenticated()`: Valida o token JWT do header `Authorization: Bearer <token>`
- Extrai `userId` do token e adiciona a `req.userId` para uso nas rotas

### Rotas de Autenticação (`back/src/routes/authRoutes.js`)
- `/signup`: POST - Cadastro com validações
- `/login`: POST - Login com bcrypt para verificação de senha

### Rotas Protegidas (`back/src/routes/tableRoutes.js`)
- Todas as rotas agora usam `isAuthenticated` middleware
- GET, POST, PUT, DELETE em `/tables` e `/tables/:id`

### Banco de Dados (`back/database/prisma/schema.prisma`)
```prisma
model User {
  id       String @id @default(uuid())
  name     String
  email    String @unique
  password String
}
```

## Configuração do Token JWT

- **Algoritmo**: HS256 (HMAC com SHA-256)
- **Expiração**: 24 horas
- **Secret**: Definido em `process.env.JWT_SECRET`
- **Payload**: `{ userId: string }`

## Próximos Passos (Quando Necessário)

1. Aplicar proteção JWT a outras rotas (chains, rules, logs)
2. Adicionar roles/permissões de usuário
3. Implementar refresh token
4. Adicionar auditoria de logs
5. Implementar recuperação de senha

## Testando com requests.http

Abra o arquivo `requests.http` e execute as requisições na seguinte ordem:

1. **Signup** - Cria um novo usuário e recebe um token
2. **Login** - Faz login e recebe um token (use este nas próximas requisições)
3. **Create Table** - POST /tables com token
4. **Get Tables** - GET /tables com token
5. Outros operações de table...

O token do signup é automaticamente usado nas próximas requisições graças à variável `@token`.
