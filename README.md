# AXION Web 1.0 — Primeira entrega

Interface responsiva para abastecimento. **Esta versão é demonstrativa e não acessa o Google Sheets.**

## Arquivos
- `index.html`: estrutura do site
- `styles.css`: visual responsivo
- `app.js`: navegação, busca, categorias, OK/S/E, desfazer e contadores
- `config.js`: configuração do modo demonstração
- `demo-data.js`: produtos fictícios
- `manifest.webmanifest`: atalho de aplicativo

## Publicar no GitHub Pages
1. Crie um repositório, por exemplo `axion-web`, no GitHub. Pode ser público, pois os arquivos **não contêm segredos nem dados reais**.
2. Envie os seis arquivos para a **raiz** do repositório (não envie somente o ZIP).
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Selecione `main` e `/ (root)`; salve.
6. Aguarde a publicação. O GitHub mostrará o endereço em Pages.

## Comportamento da demonstração
- OK, S/E e Desfazer funcionam **somente no navegador atual**.
- As escolhas ficam salvas no `localStorage` desse navegador.
- Não há sincronização entre aparelhos ou com planilhas.
- O botão Atualizar redesenha os dados locais.
- Nenhuma credencial ou token deve ser inserido nos arquivos do site.

## Próxima fase: integração real
Arquitetura planejada: Python AXION → Google Sheets → API autenticada (servidor/Worker) → AXION Web.
A API deve expor endpoints como GET /api/pendencias, GET /api/historico e POST /api/operacoes, com autenticação, validação de itens, controle de concorrência, idempotência e gravação auditável. Os tokens de integração ficam **somente no servidor**. O frontend não deve receber segredos.

Antes de desenvolver a API, precisamos conferir o contrato JSON do AXION atual e as colunas reais da planilha, evitando inventar nomes de campos e quebrar a captura do USE.
