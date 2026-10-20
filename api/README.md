# API de inscrições

Node.js 22+, Express e MongoDB. Não disponibiliza rota pública de listagem dos inscritos.

## Desenvolvimento

Nesta pasta:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Configure `MONGODB_URI` com um MongoDB local ou Atlas. O servidor só inicia após conectar e criar o índice único de CRM + UF.

`npm test` verifica o contrato HTTP com persistência substituída em memória: validação, normalização, duplicidade, CORS e indisponibilidade. Esses testes não substituem a verificação com MongoDB real.

## Rotas

- `GET /health`: disponibilidade da API e conexão com banco.
- `POST /api/inscricoes`: recebe `nome`, `crm`, `celular`, `estado` e `especialidade`.

Retornos: 201 para cadastro gravado, 400 para dados inválidos, 409 para CRM + UF já inscrito, 429 para excesso de tentativas e 503 para falha de persistência. Celular é armazenado apenas com dígitos; CRM sem zeros à esquerda. A validação é de formato, sem consulta ao conselho profissional.

## Render

Crie um Web Service com:

- Diretório raiz: `api`
- Build: `npm ci`
- Start: `npm start`
- Health check: `/health`
- `MONGODB_URI`: string de conexão secreta do Atlas
- `MONGODB_DB`: `entera`
- `FRONTEND_ORIGINS`: origem HTTPS exata do formulário no Cloudflare Pages. Várias origens são separadas por vírgula, sem barra final.
- `TRUST_PROXY`: `1` para uma camada de proxy; ajuste à infraestrutura efetiva para preservar o controle por IP.

O Render fornece `PORT`. Autorize a conexão do serviço ao Atlas conforme as regras de rede do banco. Mantenha `.env` fora do controle de versão.

O limitador é por processo; para múltiplas instâncias, use um armazenamento compartilhado. CORS controla navegadores e não autentica clientes. Antes de abrir o cadastro público, revisar o aviso de privacidade e avaliar proteção contra automação conforme o volume esperado.
