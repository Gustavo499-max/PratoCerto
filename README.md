# PratoCerto API

API de restaurantes com persistência em PostgreSQL (via Prisma), arquitetura
em camadas e autenticação JWT. Inclui uma interface HTML simples para
consultar e cadastrar restaurantes.

## Stack
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT (`jsonwebtoken`) + hash de senha (`bcryptjs`)
- HTML + CSS + JS puro para a interface (`public/`)

## Estrutura do projeto
```
pratocerto/
├── docs/
│   └── adr/                      # Architecture Decision Records
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── public/                       # Interface HTML
│   ├── index.html
│   ├── style.css
│   └── script.js
├── src/
│   ├── app.js                    # configura a aplicação Express
│   ├── database/
│   │   └── prisma.js             # conexão única com o Prisma
│   └── modules/
│       ├── restaurants/
│       │   ├── restaurant.routes.js
│       │   ├── restaurant.controller.js
│       │   └── restaurant.service.js
│       └── auth/
│           ├── auth.routes.js
│           ├── auth.controller.js
│           ├── auth.service.js
│           └── auth.middleware.js
├── server.js                     # liga o servidor
├── package.json
├── .env.example
└── .gitignore
```

## Como rodar

### 1. Pré-requisitos
- Node.js 18+
- PostgreSQL instalado e rodando localmente (ou em algum serviço na nuvem)

### 2. Instale as dependências
```bash
npm install
```

### 3. Crie o banco de dados
Abra o `psql` (ou outro cliente PostgreSQL) e crie o banco:
```sql
CREATE DATABASE pratocerto;
```

### 4. Configure as variáveis de ambiente
O projeto já vem com um arquivo `.env` de exemplo. Edite-o com sua senha real
do PostgreSQL:
```
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/pratocerto"
JWT_SECRET="troque-por-uma-chave-longa-e-aleatoria"
PORT=3000
```

### 5. Gere o Prisma Client e rode a migration
```bash
npx prisma generate
npx prisma migrate dev --name init
```
Isso cria as tabelas `restaurants` e `users` no banco.

### 6. (Opcional) Popule o banco com dados iniciais
```bash
npm run prisma:seed
```

### 7. Suba o servidor
```bash
npm start
```
Você deve ver:
```
PratoCerto rodando na porta 3000
```

### 8. Abra a interface
Acesse **http://localhost:3000** no navegador. Você pode:
- ver a lista de restaurantes (rota pública);
- criar uma conta e entrar;
- cadastrar um novo restaurante (exige estar logado).

## Rotas da API

| Método | Rota               | Protegida? | Descrição                          |
|--------|--------------------|:----------:|-------------------------------------|
| GET    | `/restaurants`     | Não        | Lista todos os restaurantes         |
| POST   | `/restaurants`     | Sim        | Cadastra um novo restaurante        |
| POST   | `/auth/register`   | Não        | Cria uma nova conta de usuário      |
| POST   | `/auth/login`      | Não        | Autentica e devolve um token JWT    |
| GET    | `/auth/me`         | Sim        | Retorna o usuário autenticado       |
| GET    | `/health`          | Não        | Verifica se a API está no ar        |

Para rotas protegidas, envie o header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### Exemplo de teste com curl

```bash
# Cadastrar usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Aluno","email":"aluno@pratocerto.com","password":"123456"}'

# Login (copie o "token" da resposta)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@pratocerto.com","password":"123456"}'

# Cadastrar restaurante (rota protegida)
curl -X POST http://localhost:3000/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"name":"Cantina da Nona","category":"Italiana","rating":4.7}'

# Listar restaurantes (rota pública)
curl http://localhost:3000/restaurants
```

## Ferramentas úteis do Prisma
```bash
npx prisma studio    # interface visual para ver/editar os dados
npx prisma migrate dev --name nome-da-mudanca   # nova migration
```

## Decisões de arquitetura (ADRs)
Todas as decisões arquiteturais importantes estão documentadas em
`docs/adr/`:

- **ADR-001** — Armazenar restaurantes em memória (decisão inicial, hoje
  superada)
- **ADR-002** — Persistência com PostgreSQL e Prisma
- **ADR-003** — Arquitetura em camadas
- **ADR-004** — Autenticação com JWT

## Publicando no GitHub
```bash
git init
git add .
git commit -m "PratoCerto: API com Prisma, arquitetura em camadas e JWT"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```
O arquivo `.env` já está no `.gitignore` e não será enviado ao GitHub —
apenas o `.env.example` (sem segredos reais) é versionado.
