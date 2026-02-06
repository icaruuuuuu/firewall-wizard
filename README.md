# Firewall Wizard

Uma plataforma web completa para gerenciamento centralizado de firewalls baseados em **nftables**. Oferece dashboard em tempo real, visualização de configurações de firewall e análise avançada de logs com suporte a busca por expressões regulares.

## Sobre o Projeto

O **Firewall Wizard** é uma aplicação web moderna desenvolvida para simplificar a administração de firewalls em ambientes Linux. Fornece uma interface intuitiva para gerenciar tables, chains e rules do nftables, além de monitorar logs e status em tempo real.

A plataforma foi desenvolvida como projeto acadêmico de Desenvolvimento Web, com foco em usabilidade e funcionalidade para administradores de sistemas.

## Características Principais

### Dashboard
- Visão geral do estado do firewall
- Contadores em tempo real (rules, tables, chains)
- Indicadores de status e saúde

### Gerenciamento de Firewall
- **Tables**: Visualização e gerenciamento de tabelas
- **Chains**: Listagem e configuração de chains
- **Rules**: Edição e manipulação de regras com interface intuitiva

### Análise e Monitoramento
- **Logs**: Visualização centralizada de logs do firewall
- **Busca Avançada**: Filtros com suporte a Expressões Regulares (Regex)
- **Autenticação**: Sistema seguro de login com JWT

### Interface
- Design responsivo e profissional
- Navegação simplificada
- Temas e layouts otimizados para diferentes resoluções

## Stack Tecnológico

### Frontend
- HTML5
- CSS3
- JavaScript (vanilla)

### Backend
- Node.js
- Express.js
- Morgan (logging)
- CORS

### Banco de Dados
- MySQL 8.3
- Prisma ORM
- MariaDB Adapter

### Infraestrutura
- Docker & Docker Compose
- nftables (CLI)

### Autenticação e Segurança
- JWT (JSON Web Tokens)
- Bcrypt (hash de senhas)

## Estrutura do Projeto

```
firewall-wizard/
├── back/                          # Backend (Node.js)
│   ├── src/
│   │   ├── index.js              # Entrada principal
│   │   ├── fw-daemon.js          # Daemon do firewall
│   │   ├── lib/                  # Utilidades
│   │   ├── middlewares/          # Middlewares Express
│   │   ├── models/               # Modelos de dados
│   │   └── routes/               # Rotas da API
│   └── database/
│       ├── db.js                 # Configuração do BD
│       ├── seeders.js            # Seeders
│       └── prisma/
│           ├── schema.prisma     # Schema Prisma
│           └── migrations/       # Migrações
├── front/                         # Frontend
│   └── public/
│       ├── index.html            # Página principal
│       ├── login.html            # Página de login
│       ├── signup.html           # Página de registro
│       ├── assets/               # CSS e imagens
│       ├── js/                   # JavaScript
│       └── pages/                # Componentes HTML
├── docker-compose.yml            # Orquestração
└── package.json                  # Dependências

```

## Pré-requisitos

- Linux com suporte a **nftables**
- **Node.js** (v18+)
- **npm**
- **Docker** e **Docker Compose**
- **MySQL** 8.3 (ou via Docker)

## Como Executar

Siga os passos abaixo a partir da raiz do projeto (`firewall-wizard`). Cada comando deve ser executado no terminal, na ordem indicada.

1. Clone o repositório e entre na pasta do projeto

```bash
git clone https://github.com/icaruuuuuu/firewall-wizard.git
cd firewall-wizard
```

2. Instale as dependências do projeto

```bash
npm install
```

3. Suba os serviços necessários via Docker (MySQL)

```bash
docker compose up -d
```

4. Gere e aplique migrations do Prisma

> Aguarde o banco de dados estar pronto antes de executar os comandos abaixo.

```bash
cd back/database
npx prisma generate
npx prisma migrate deploy
cd -
```

5. Inicie o daemon do firewall (pode exigir permissões de root)

```bash
sudo node back/src/fw-daemon.js
```

6. Em um novo terminal, inicie o servidor da API (a partir da raiz do projeto)

```bash
node back/src/index.js
```

Observações rápidas:
- Se estiver usando Docker para o banco, verifique os logs com `docker compose logs` caso as migrations falhem.
- O `fw-daemon.js` interage com o sistema (nftables) e pode requerer permissões elevadas.
- Para desenvolvimento local, pare e suba o `docker compose` novamente se alterar configurações do banco.


## API Endpoints

A API está disponível em `/api` com os seguintes endpoints principais:

- `/api/dashboard` - Dashboard
- `/api/tables` - Gerenciamento de tabelas
- `/api/chains` - Gerenciamento de chains
- `/api/rules` - Gerenciamento de regras
- `/api/logs` - Visualização de logs
- `/api/auth` - Autenticação (login/signup)
- `/api/users` - Gerenciamento de usuários
- `/api/submit` - Aplicar mudanças no arquivo de configuração nftables.

## Autores

- Bruno de Farias Andrade
- Ícaro Machado da Silva
- Pedro Henrique Rodrigues Alves

## Orientador

Prof. Luiz Carlos Rodrigues Chaves

## Agradecimentos

- Turma de Desenvolvimento Web 2025.2
- Instituição de Ensino
- Comunidade de software livre

## Licença

Projeto acadêmico - Direitos reservados.
