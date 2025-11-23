# Firewall Wizard

Firewall Wizard é uma interface web simples para criar, listar e gerenciar regras, cadeias (chains) e tabelas de um firewall. Este repositório contém uma interface front-end estática e arquivos de configuração/recursos que permitem editar e visualizar regras de firewall localmente.

## Recursos
- Interface web para criar e listar regras, cadeias e tabelas.
- Arquivos de configuração e exemplos em HTML e JSON.
- Layout e scripts organizados para fácil customização.

## Estrutura do projeto
- `front/` : arquivos estáticos da interface (entrada principal `index.html`).
- `back/db.json` : banco de dados JSON simples usado como fonte de dados (mock/persistência).
- `config/` : páginas de configuração e templates (`chain.html`, `rule.html`, `table.html`, etc.).
- `css/` : estilos usados pela interface.
- `js/` : scripts que controlam o comportamento da UI (`ruleconfig.js`, `tableconfig.js`, etc.).
- `logs/` : visualização de logs (`logs.html`).
- `imgs/` : imagens e ícones usados pela UI.

## Como executar localmente

A aplicação é composta por arquivos estáticos. Para testar localmente você pode servir a pasta `front` (ou o diretório raiz) usando um servidor HTTP simples.

Exemplos rápidos:

```bash
# servir apenas a pasta front na porta 8000
cd front && python3 -m http.server 8000

# ou, a partir da raiz do projeto, usando npx http-server (se tiver Node.js)
npx http-server front -p 8000
```

Depois abra no navegador: `http://localhost:8000` e navegue até a interface.

Se a interface precisa ler/escrever `back/db.json`, verifique se seus scripts esperam uma API; atualmente `db.json` é um arquivo estático de mock — para operações persistentes você pode criar um pequeno servidor (por exemplo com Express, Flask ou similar) que exponha endpoints REST que leiam/escrevam `back/db.json`.

## Edição e personalização
- Para alterar o layout, edite os arquivos em `config/` e `css/`.
- Para ajustar a lógica da UI, abra `js/` e edite os arquivos correspondentes (`ruleconfig.js`, `chainconfig.js`, `tableconfig.js`, etc.).
- Imagens e ícones ficam em `imgs/`.

## Desenvolvimento
- Recomenda-se usar um servidor estático durante o desenvolvimento para evitar problemas de CORS ao carregar recursos locais.
- Se quiser uma API de back-end mínima para persistência, um exemplo com Node/Express poderia expor:

```js
// Exemplo mínimo (node/express)
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

app.get('/db', (req, res) => res.sendFile(__dirname + '/back/db.json'));
app.post('/db', (req, res) => {
	fs.writeFileSync(__dirname + '/back/db.json', JSON.stringify(req.body, null, 2));
	res.status(200).send({ok:true});
});
app.listen(3000);
```

## Testes manuais
- Abra a interface em um navegador e verifique:
	- Criação de novas regras/tabelas/cadeias.
	- Edição e remoção de entradas (se implementado pelo front).
	- Visualização de logs em `logs/logs.html`.

## Contribuição
- Abra uma issue descrevendo o que deseja melhorar.
- Para PRs: clone o repositório, crie uma branch com nome descritivo, faça commits pequenos e envie o PR contra `main`.

## Licença
Coloque aqui a licença do projeto (ex: MIT). Se não souber, adicione um arquivo `LICENSE` com a licença desejada.

---

Se quiser, eu posso:
- adicionar um pequeno servidor Node/Express para persistência;
- criar um script de inicialização (`package.json`) para desenvolvimento;
- ou ajustar o README com instruções específicas do seu ambiente.

