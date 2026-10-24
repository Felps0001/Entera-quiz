# Inscrição Entera

Frontend React com Vite. O quiz existente continua em `../public`.

Estado atual: o formulário foi removido da página e substituído pela mensagem “Inscrições finalizadas!”. A página não envia novos cadastros. A API permanece inalterada; as instruções de formulário abaixo documentam a versão anterior.

## Desenvolvimento

Requer Node.js 22+. Nesta pasta:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Abra http://localhost:5173. Inicie também a API seguindo `../api/README.md`.
`VITE_API_URL` aponta para a URL pública da API, sem `/api` no final.
O formulário não simula sucesso: é necessário ter a API e o MongoDB disponíveis.

## Cloudflare Pages

- Diretório raiz: `inscricao`
- Comando de build: `npm run build`
- Diretório de saída: `dist`
- Variável `VITE_API_URL`: URL HTTPS do serviço no Render
- Node.js: 22 ou superior

Variáveis Vite são públicas e entram no build. Nunca coloque a URI ou senha do MongoDB no frontend.

## Decisões desta versão

- Os cinco campos são obrigatórios.
- Estado significa UF do CRM. Confirmar essa interpretação antes da publicação.
- Especialidade aceita texto livre e oferece sugestões.
- Após gravar, mostra confirmação; não redireciona para o quiz.
- Visual claro inspirado nas páginas 31–33 do brandbook, com azul acinzentado, lilás e textura. Arial é usada enquanto as fontes oficiais não estiverem disponíveis.
- Antes de coletar dados reais, definir o aviso de privacidade, responsável pelo tratamento e finalidade do uso dos dados com a organização.
