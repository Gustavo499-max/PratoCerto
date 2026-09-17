# ADR-003 - Arquitetura em camadas

## Status
Aceita

## Data
03/09/2026

## Responsável
Equipe PratoCerto

## Contexto
Com o PostgreSQL integrado (ADR-002), o arquivo `server.js` passou a
concentrar várias responsabilidades: inicializar o Express, configurar
middlewares, definir rotas, validar dados de entrada e conversar diretamente
com o Prisma. Conforme a aplicação cresce (novos domínios, como autenticação),
esse arquivo tende a ficar cada vez maior e mais difícil de manter e testar.

## Alternativas consideradas
1. Manter tudo em `server.js` (status quo).
2. Separar por tipo técnico de arquivo (`routes/`, `controllers/`, `services/`
   soltos na raiz).
3. Organizar por camadas dentro de módulos de domínio
   (`src/modules/<dominio>/`), com `routes`, `controller` e `service` por
   módulo, e uma camada `database` compartilhada.

## Decisão
Adotar a opção 3: separar a aplicação em camadas dentro de módulos de
domínio.

```
src/
├── app.js                    -> configura a aplicação Express
├── database/
│   └── prisma.js             -> conexão única com o Prisma
└── modules/
    ├── restaurants/
    │   ├── restaurant.routes.js
    │   ├── restaurant.controller.js
    │   └── restaurant.service.js
    └── auth/
        ├── auth.routes.js
        ├── auth.controller.js
        ├── auth.service.js
        └── auth.middleware.js
server.js                     -> apenas liga o servidor
```

Responsabilidade de cada camada:
- **server.js**: liga o servidor na porta configurada.
- **app.js**: configura middlewares, arquivos estáticos e registra as rotas.
- **routes**: define os caminhos HTTP e aponta cada um para o controller
  correspondente.
- **controller**: recebe `req`/`res`, valida a entrada e formata a resposta.
- **service**: contém as regras de negócio; não depende de `req`/`res`.
- **database**: expõe a conexão com o Prisma para o restante da aplicação.

## Justificativa
- Cada camada tem uma única responsabilidade, o que facilita entender,
  testar e alterar o código.
- Novos domínios (como `auth`) se encaixam no mesmo padrão sem misturar
  responsabilidades com os domínios existentes.
- O Service não depender de `req`/`res` facilita reaproveitar a lógica de
  negócio em outros contextos (ex: um job, um script de seed, testes).
- O comportamento externo da API não muda: é uma refatoração.

## Consequências

### Positivas
- Código mais fácil de localizar e manter conforme o projeto cresce.
- Domínios (restaurants, auth, futuros módulos) isolados entre si.
- Facilita escrever testes unitários para `service` sem precisar de um
  servidor HTTP rodando.

### Negativas
- Mais arquivos e pastas para um projeto pequeno.
- Exige disciplina da equipe para não vazar responsabilidades entre camadas
  (ex: acessar o Prisma direto de uma route).

## Critérios de revisão
Esta decisão deverá ser reavaliada quando:
1. O número de módulos justificar dividir o projeto em múltiplos serviços
   (arquitetura de microsserviços).
2. Regras de negócio compartilhadas entre módulos ficarem difíceis de
   reaproveitar dentro da estrutura atual.
