# FittTest

Aplicação web para registro e acompanhamento de exercícios físicos, com interface moderna, dashboard, CRUD de categorias e exercícios, e API backend documentada via Swagger.

## Estrutura de Pastas

```
FittTest/
├── api/                # Backend Node.js/Express (API)
│   ├── index.js        # Código principal da API
│   ├── package.json    # Dependências do backend
│   └── README.txt      # Instruções da API
├── index.html          # Página única da aplicação web
├── style.css           # Estilos modernos e responsivos
├── script.js           # Lógica JS da interface
├── .gitignore          # Arquivos/pastas ignorados pelo git
└── README.md           # Este arquivo
```

## Tecnologias Utilizadas

- **Frontend:** HTML, CSS, JavaScript puro
- **Persistência:** localStorage (dados mantidos no navegador)
- **Backend:** Node.js, Express
- **Documentação:** Swagger (via swagger-ui-express)

## Funcionalidades

- Cadastro e login de usuário (senha de 6 dígitos)
- CRUD de categorias de exercícios
- CRUD de exercícios (apenas nome, vinculação feita no registro)
- Registro de exercícios realizados (categoria, dificuldade, dia, duração)
- Visualização dos exercícios recentes
- Dashboard com métricas e gráfico semanal
- API RESTful para todas as operações, com documentação interativa

## Como rodar o Frontend

1. Abra o arquivo `index.html` em qualquer navegador moderno.
2. Todos os dados ficam salvos no navegador enquanto a aba estiver aberta.

## Como rodar o Backend/API

1. Abra o terminal na pasta `api`:
   ```powershell
   cd api
   npm install
   npm start
   ```
2. Acesse a documentação Swagger em:
   [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints principais da API

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

## Testes Automatizados

### Cypress (Testes de Interface)

Os testes de interface estão em `cypress/e2e/app.cy.js` e cobrem:
- Cadastro e login
- Adição, edição e exclusão de exercício
- Registro de exercício

Para rodar:
1. Instale o Cypress:
   ```powershell
   npm install cypress --save-dev
   ```
2. Execute:
   ```powershell
   npx cypress open
   ```
3. Escolha o arquivo `app.cy.js` para rodar os testes.

### k6 (Testes de Performance da API)

Os testes de performance estão em `k6/performance.js` e simulam:
- Cadastro de usuário
- Login
- Adição de exercício
- Registro de exercício

Para rodar:
1. Instale o k6: https://k6.io/docs/getting-started/installation/
2. Execute:
   ```powershell
   k6 run k6/performance.js
   ```

## Observações

- O frontend funciona totalmente em memória/localStorage, sem necessidade de backend para uso básico.
- O backend é opcional, útil para integração, testes ou uso multiusuário.
- Sempre que novas funcionalidades forem adicionadas, este README será atualizado automaticamente.

---


