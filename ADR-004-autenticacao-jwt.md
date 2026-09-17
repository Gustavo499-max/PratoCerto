# ADR-004 - Autenticação com JWT

## Status
Aceita

## Data
10/09/2026

## Responsável
Equipe PratoCerto

## Contexto
Até este ponto, qualquer pessoa podia cadastrar restaurantes na API, sem
identificação de quem fez o cadastro. Precisávamos de um mecanismo de
autenticação para:

- permitir que usuários criem uma conta e façam login;
- identificar o usuário autenticado;
- proteger o cadastro de restaurantes (`POST /restaurants`), permitindo-o
  apenas para usuários autenticados.

## Alternativas consideradas
| # | Opção | Observação |
|---|-------|------------|
| 1 | JWT (JSON Web Token) | Stateless, simples de implementar, amplamente usado em APIs REST |
| 2 | Sessão + cookie no servidor | Exige armazenamento de sessão (memória ou Redis) |
| 3 | AWS Cognito | Solução gerenciada, robusta, mas adiciona dependência de infraestrutura externa e curva de aprendizado |
| 4 | Login social (Google/OAuth) | Bom para produtos consumer, mas não resolve autenticação própria de usuários cadastrados na base |

## Decisão
Adotar **JWT** para autenticação, com senhas armazenadas como hash usando
**bcrypt**.

Fluxo:
```
POST /auth/register -> cria usuário (senha em hash)
POST /auth/login     -> valida credenciais e devolve um JWT
GET  /auth/me        -> retorna o usuário autenticado (exige token)
POST /restaurants    -> exige token válido (Authorization: Bearer <token>)
```

## Justificativa
- JWT é stateless: o servidor não precisa guardar sessão, o que combina com
  uma API REST simples como a do PratoCerto.
- Bibliotecas maduras em Node.js (`jsonwebtoken`, `bcryptjs`) resolvem os
  pontos mais sensíveis (assinatura do token, hashing de senha) sem
  reinventar criptografia.
- É a abordagem mais simples de configurar neste estágio do projeto, sem
  exigir infraestrutura ou provedores externos.
- Se o projeto crescer e precisar de login social ou de um provedor gerenciado
  (Cognito, Auth0), o módulo `auth` isolado facilita a substituição futura.

## Consequências

### Positivas
- Senhas nunca são armazenadas em texto puro (hash via bcrypt).
- `POST /restaurants` deixa de ser uma rota pública, exigindo autenticação.
- O token carrega a identidade do usuário (`sub`, `email`), permitindo
  futuramente associar cada restaurante ao usuário que o cadastrou.
- Não exige um serviço de sessão separado (ex: Redis).

### Negativas
- Um JWT emitido não pode ser revogado individualmente antes de expirar
  (não há, por padrão, uma "lista negra" de tokens).
- A chave secreta (`JWT_SECRET`) se torna um segredo crítico: se vazar,
  qualquer token pode ser forjado.
- É necessário lidar com expiração e renovação de token no cliente.

## Critérios de revisão
Esta decisão deverá ser reavaliada quando:
1. For necessário revogar tokens individualmente antes da expiração (ex:
   logout forçado, banimento de usuário).
2. Surgir a necessidade de login social ou single sign-on.
3. O número de usuários e a exigência de segurança justificarem migrar para
   um provedor de identidade gerenciado (ex: AWS Cognito, Auth0).

## Notas
- O `JWT_SECRET` fica apenas no `.env`, nunca no código-fonte nem versionado
  no Git.
- O middleware `auth.middleware.js` centraliza a validação do token,
  podendo ser reutilizado por qualquer rota que precise de autenticação.
