# ADR-001 - Armazenar restaurantes em memória

## Status
Superada pela ADR-002

## Data
20/08/2026

## Responsável
Equipe PratoCerto

## Contexto
Na primeira versão da API do PratoCerto, a aplicação precisava apenas permitir:

- consultar restaurantes;
- cadastrar novos restaurantes.

O produto estava em fase de prototipação, teste e validação. A prioridade era
validar o fluxo da aplicação de forma rápida e simples, antes de aumentar a
complexidade da arquitetura.

## Alternativas consideradas
1. Array em memória
2. PostgreSQL
3. MongoDB
4. SQLite
5. Firebase
6. Arquivo JSON

## Decisão
Adotar um array em memória como mecanismo de armazenamento dos restaurantes na
versão inicial do serviço.

## Justificativa
- Permite maior velocidade no desenvolvimento.
- Facilita os primeiros testes da API.
- Possui baixa complexidade.
- Não exige configuração de infraestrutura.
- Não possui custo adicional para esta fase do projeto.

## Consequências

### Positivas
- Desenvolvimento mais rápido.
- Facilidade para testar GET e POST.
- Menor complexidade inicial.
- Permite validar o conceito da aplicação rapidamente.

### Negativas
- Os dados são perdidos quando o servidor reinicia.
- Não existe persistência dos dados.
- Não é adequado para múltiplas instâncias da aplicação.
- Possui limitações para consultas e análises mais complexas.

## Critérios de revisão
Esta decisão deveria ser reavaliada quando:
1. O MVP fosse validado e houvesse decisão de avançar para produção.
2. Houvesse necessidade de manter os dados entre reinicializações e deploys.
3. O volume de dados ultrapassasse o que é razoável manter em memória.

## Notas
Esta foi uma decisão temporária para a fase inicial do projeto. O critério de
revisão nº2 se concretizou, o que motivou a ADR-002, que substitui esta
decisão pela persistência com PostgreSQL.
