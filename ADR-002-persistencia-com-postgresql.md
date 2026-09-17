# ADR-002 - Persistência com PostgreSQL e Prisma

## Status
Aceita

## Data
27/08/2026

## Responsável
Equipe PratoCerto

## Contexto
A ADR-001 registrou o armazenamento em memória como decisão temporária. Um de
seus critérios de revisão se concretizou: passamos a precisar manter os dados
cadastrados entre reinicializações do servidor. O array em memória perdia
todos os restaurantes cadastrados sempre que o processo Node.js era encerrado.

## Alternativas consideradas
| # | Opção | Observação |
|---|-------|------------|
| 1 | PostgreSQL | Banco relacional, ACID, SQL padrão, ecossistema Node.js maduro |
| 2 | MongoDB | Banco orientado a documentos, schema flexível |
| 3 | SQLite | Banco embarcado, simples, mas limitado para múltiplas instâncias |
| 4 | Firebase | Solução gerenciada, adiciona dependência de um provedor externo |
| 5 | Arquivo JSON | Persistência simples, mas sem integridade e sem concorrência segura |

## Decisão
Adotar **PostgreSQL** como banco de dados relacional, acessado pela aplicação
por meio do **Prisma ORM**.

## Justificativa
- O domínio (restaurantes, e futuramente usuários e pedidos) é naturalmente
  relacional.
- PostgreSQL oferece conformidade ACID, essencial para operações de cadastro.
- O Prisma oferece migrations versionadas, type-safety e uma API de consultas
  simples, reduzindo a chance de erros manuais em SQL.
- Ecossistema maduro em Node.js, com ampla documentação e comunidade.
- Sem custo de licença.

## Consequências

### Positivas
- Os dados persistem entre reinicializações e deploys.
- Suporte a múltiplas instâncias da aplicação acessando o mesmo banco.
- Consultas mais ricas (ordenação, filtros, relacionamentos futuros).
- Histórico de alterações de schema via migrations do Prisma.

### Negativas
- Introduz dependência de infraestrutura externa (é preciso instalar/hospedar
  o PostgreSQL).
- Exige gerenciar variáveis de ambiente sensíveis (`DATABASE_URL`).
- Pequeno aumento de complexidade no setup do ambiente de desenvolvimento.
- Se o banco ficar indisponível, a API responde com erro 500 nas rotas que
  dependem dele.

## Critérios de revisão
Esta decisão deverá ser reavaliada quando:
1. O volume de dados ou de tráfego exigir réplicas de leitura ou sharding.
2. Surgir necessidade de modelagem predominantemente não relacional.
3. Requisitos de latência exigirem uma camada de cache dedicada (ex: Redis).

## Notas
A conexão com o Prisma foi isolada em `src/database/prisma.js`, para que o
restante da aplicação não dependa diretamente da biblioteca do banco.
