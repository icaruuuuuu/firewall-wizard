# 🔥 Firewall Wizard 

Um painel web completo para **gerenciamento, visualização e análise** de firewalls baseados em **nftables**, incluindo dashboard em tempo real, listagem de regras, tabelas, chains, logs e busca avançada com regex.

---

## 📘 Sobre o Projeto

O **Firewall Wizard** é uma interface moderna e intuitiva desenvolvida para facilitar a administração de firewalls utilizando **nftables**.

Ele permite visualizar a estrutura completa do firewall, monitorar seu estado, manipular regras e analisar logs — tudo de forma clara, rápida e acessível tanto para iniciantes quanto para administradores experientes.

---

## ✨ Funcionalidades Principais

### 🧭 Dashboard Completo
- Contagem total de **rules**
- Número de **tables**
- Número de **chains**
- Indicadores de uso e status

### 📚 Listagens Detalhadas
- Tabelas (**tables**)
- Correntes (**chains**)
- Regras (**rules**)

### 🔍 Busca Avançada
- Filtro poderoso utilizando **Expressões Regulares (Regex)**  
  Ideal para localizar regras específicas em ambientes grandes.

### 📜 Logs Integrados
- Visualização otimizada dos logs do firewall
- Atualização dinâmica

### 🖥️ Interface Moderna
- Layout inspirado em painéis de firewall profissionais
- Navegação simples e responsiva

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript**

### Backend
- **Node.js**
- **json-server**

### Firewall
- **nftables** via CLI
- **JSON** para estrutura interna de regras

---

## 📦 Instalação

### ✔️ Pré-requisitos
- Linux com suporte a **nftables**
- **Node.js**
- **npm**
- **json-server**

---

## ▶️ Como Executar?

### Modo Local

```bash
cd firewall-wizard/back

npx json-server db.json
```

O servidor JSON mock será iniciado e fornecerá os dados necessários para o painel.

---

## 👥 Equipe

- Bruno de Farias Andrade
- Ícaro Machado da Silva
- Pedro Henrique Rodrigues Alves

## 🙏 Agradecimentos

- Ao GRANDE E ÚNICO Professor Luiz Carlos Rodrigues Chaves, pela orientação e dedicação.
- Às autoridades idealizadoras e desenvolvedoras do Firewall Wizard.
- À Turma de Desenvolvimento Web 2025.2, pelo apoio e colaboração.
