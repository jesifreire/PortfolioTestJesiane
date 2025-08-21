# FittTest API

API simples em Node.js/Express para as principais funcionalidades do FittTest, com documentação Swagger.

## Como usar

1. Instale as dependências:
   npm install

2. Inicie a API:
   npm start

3. Acesse a documentação Swagger:
   http://localhost:3000/api-docs

## Endpoints principais

- POST /user: Cadastro de usuário
- POST /login: Login

- GET /categories: Listar categorias
- POST /categories: Adicionar categoria
- PUT /categories/{idx}: Editar categoria
- DELETE /categories/{idx}: Excluir categoria

- GET /exercises: Listar exercícios
- POST /exercises: Adicionar exercício
- PUT /exercises/{idx}: Editar exercício
- DELETE /exercises/{idx}: Excluir exercício

- GET /records: Listar registros de exercícios
- POST /records: Registrar exercício realizado

- GET /progress: Progresso do usuário

Todos os dados são mantidos em memória enquanto o servidor está rodando.
