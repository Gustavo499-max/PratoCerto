# 🍽️ PratoCerto

> **API de restaurantes com autenticação, persistência de dados e arquitetura em camadas.**

O **PratoCerto** é uma aplicação desenvolvida para gerenciamento de restaurantes, permitindo consultar estabelecimentos, cadastrar novos restaurantes e realizar autenticação de usuários.

O projeto utiliza **Node.js, Express, PostgreSQL, Prisma ORM e JWT**, além de possuir uma interface web desenvolvida com **HTML, CSS e JavaScript**.

---

## 🌐 Acesse a aplicação

### 🚀 Aplicação online

👉  https://gustavo499-max.github.io/PratoCerto/



### 💻 Executar localmente

Depois de iniciar o servidor, a aplicação estará disponível em:

**http://localhost:3000**

---


## 📋 Sobre o projeto

O PratoCerto foi desenvolvido aplicando conceitos de **Software Architecture & Design Patterns**.

A aplicação evoluiu de um armazenamento simples em memória para uma solução com persistência utilizando **PostgreSQL e Prisma ORM**.

Também foi implementada uma arquitetura organizada em camadas e autenticação baseada em **JWT (JSON Web Token)**.

### Principais funcionalidades

- 🍴 Listagem de restaurantes
- ➕ Cadastro de restaurantes
- 👤 Cadastro de usuários
- 🔐 Login de usuários
- 🎫 Autenticação utilizando JWT
- 🔒 Proteção de rotas
- 🗄️ Persistência com PostgreSQL
- 🔄 Prisma ORM
- 🧱 Arquitetura em camadas
- 🌐 Interface web em HTML, CSS e JavaScript
- 📑 Registro das decisões arquiteturais através de ADRs
- ❤️ Endpoint de verificação da API

---

# 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| Node.js | Ambiente de execução JavaScript |
| Express | Desenvolvimento da API REST |
| PostgreSQL | Banco de dados relacional |
| Prisma ORM | Comunicação entre aplicação e banco |
| JWT | Autenticação dos usuários |
| bcryptjs | Hash e validação das senhas |
| HTML5 | Estrutura da interface |
| CSS3 | Estilização |
| JavaScript | Interatividade da interface |
| Git | Controle de versão |
| GitHub | Hospedagem e versionamento do projeto |

---


### Responsabilidades

**Routes**  
Define os endpoints disponíveis na API.

**Controller**  
Recebe as requisições HTTP e devolve as respostas.

**Service**  
Contém as regras de negócio e operações da aplicação.

**Database**  
Gerencia a conexão com o Prisma.

**PostgreSQL**  
Responsável pela persistência dos dados.



# 🔐 Autenticação

A autenticação do PratoCerto utiliza **JWT (JSON Web Token)**.

O fluxo funciona da seguinte maneira:

```text
Cadastro
   ↓
Senha protegida com bcrypt
   ↓
Login
   ↓
Validação das credenciais
   ↓
Geração do JWT
   ↓
Token enviado ao usuário
   ↓
Acesso às rotas protegidas
```

Para acessar uma rota protegida, deve ser enviado:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

O `GET /restaurants` permanece público.

O `POST /restaurants` exige autenticação.

---

# 🔗 Rotas da API

| Método | Endpoint | Autenticação | Descrição |
|---|---|:---:|---|
| `GET` | `/restaurants` | ❌ | Lista os restaurantes |
| `POST` | `/restaurants` | 🔒 | Cadastra um restaurante |
| `POST` | `/auth/register` | ❌ | Cadastra um usuário |
| `POST` | `/auth/login` | ❌ | Realiza login |
| `GET` | `/auth/me` | 🔒 | Retorna usuário autenticado |
| `GET` | `/health` | ❌ | Verifica o status da API |

---




# 🚀 Como executar o projeto

## 1. Pré-requisitos

Antes de começar, tenha instalado:

- Node.js 18 ou superior
- PostgreSQL
- Git
- VS Code ou outro editor

---

## 2. Clone o repositório

```bash
git clone COLE_AQUI_A_URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd pratocerto
```

---

## 3. Instale as dependências

```bash
npm install
```

---

## 4. Crie o banco

No PostgreSQL:

```sql
CREATE DATABASE pratocerto;
```

---

## 5. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/pratocerto"
JWT_SECRET="SUA_CHAVE_SECRETA"
PORT=3000
```

> ⚠️ O arquivo `.env` não deve ser enviado para o GitHub.

---

## 6. Configure o Prisma

Execute:

```bash
npx prisma generate
```

Depois:

```bash
npx prisma migrate dev --name init
```

---

## 7. Popule o banco (opcional)

```bash
npm run prisma:seed
```

---

## 8. Inicie a aplicação

```bash
npm start
```

Resultado esperado:

```text
PratoCerto rodando na porta 3000
```

Agora abra:

**http://localhost:3000**

---

# 🧪 Testando a API

### Cadastrar usuário

```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Aluno","email":"aluno@pratocerto.com","password":"123456"}'
```

### Fazer login

```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"aluno@pratocerto.com","password":"123456"}'
```

A API retornará um **token JWT**.

### Cadastrar restaurante

```bash
curl -X POST http://localhost:3000/restaurants \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-d '{"name":"Cantina da Nona","category":"Italiana","rating":4.7}'
```

### Listar restaurantes

```bash
curl http://localhost:3000/restaurants
```

---

# 📑 Architecture Decision Records

As principais decisões arquiteturais do projeto estão documentadas em:

```text
docs/adr/
```

### ADR-001 — Armazenamento em memória

Primeira estratégia utilizada durante a prototipação da aplicação.

### ADR-002 — PostgreSQL + Prisma

Substituição do armazenamento temporário por persistência em banco de dados.

### ADR-003 — Arquitetura em camadas

Separação das responsabilidades entre:

```text
Routes → Controller → Service → Database
```

### ADR-004 — Autenticação JWT

Implementação de cadastro, login, proteção de senha e autenticação através de tokens JWT.

---

# 🔒 Segurança

O projeto implementa alguns cuidados importantes:

- Senhas protegidas com `bcryptjs`
- Autenticação através de JWT
- Rotas privadas protegidas por middleware
- Segredos armazenados em variáveis de ambiente
- `.env` ignorado pelo Git
- Credenciais não armazenadas diretamente no código

---

# 🧰 Prisma Studio

Para visualizar os dados do banco através de uma interface gráfica:

```bash
npx prisma studio
```

O Prisma Studio permitirá visualizar e gerenciar os registros de usuários e restaurantes.

---

# 📌 Status do projeto

**🟢 Funcional**

- [x] Interface HTML
- [x] API REST
- [x] PostgreSQL
- [x] Prisma ORM
- [x] Arquitetura em camadas
- [x] Cadastro de usuários
- [x] Login
- [x] JWT
- [x] Hash de senhas
- [x] Proteção de rotas
- [x] ADRs
- [x] Git/GitHub

---
