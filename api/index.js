const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
app.use(express.json());

// Dados em memória
let user = null;
let categories = ['Cardio', 'Força', 'Flexibilidade'];
let exercises = [];
let records = [];

// Swagger config
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FittTest API',
    version: '1.0.0',
    description: 'API simples para FittTest com documentação Swagger',
  },
  servers: [{ url: 'http://localhost:3000' }],
};
const options = {
  swaggerDefinition,
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cadastro de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário cadastrado
 */
app.post('/user', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length !== 6) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  user = { email, password };
  res.json({ message: 'Usuário cadastrado', user });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado
 */
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!user || user.email !== email || user.password !== password) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  res.json({ message: 'Login realizado', user });
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Listar categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 *   post:
 *     summary: Adicionar categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria adicionada
 */
app.get('/categories', (req, res) => {
  res.json(categories);
});
app.post('/categories', (req, res) => {
  const { name } = req.body;
  if (!name || categories.includes(name)) {
    return res.status(400).json({ error: 'Categoria inválida ou já existe' });
  }
  categories.push(name);
  res.json({ message: 'Categoria adicionada', categories });
});
/**
 * @swagger
 * /categories/{idx}:
 *   put:
 *     summary: Editar categoria
 *     parameters:
 *       - in: path
 *         name: idx
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria editada
 *   delete:
 *     summary: Excluir categoria
 *     parameters:
 *       - in: path
 *         name: idx
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria excluída
 */
app.put('/categories/:idx', (req, res) => {
  const idx = parseInt(req.params.idx);
  const { name } = req.body;
  if (!name || categories.includes(name)) {
    return res.status(400).json({ error: 'Nome inválido ou já existe' });
  }
  if (idx < 0 || idx >= categories.length) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }
  categories[idx] = name;
  res.json({ message: 'Categoria editada', categories });
});
app.delete('/categories/:idx', (req, res) => {
  const idx = parseInt(req.params.idx);
  if (idx < 0 || idx >= categories.length) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }
  categories.splice(idx, 1);
  res.json({ message: 'Categoria excluída', categories });
});

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Listar exercícios
 *     responses:
 *       200:
 *         description: Lista de exercícios
 *   post:
 *     summary: Adicionar exercício
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exercício adicionado
 */
app.get('/exercises', (req, res) => {
  res.json(exercises);
});
app.post('/exercises', (req, res) => {
  const { name, category, difficulty } = req.body;
  if (!name || !category || !difficulty) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  exercises.push({ name, category, difficulty });
  res.json({ message: 'Exercício adicionado', exercises });
});
/**
 * @swagger
 * /exercises/{idx}:
 *   put:
 *     summary: Editar exercício
 *     parameters:
 *       - in: path
 *         name: idx
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exercício editado
 *   delete:
 *     summary: Excluir exercício
 *     parameters:
 *       - in: path
 *         name: idx
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exercício excluído
 */
app.put('/exercises/:idx', (req, res) => {
  const idx = parseInt(req.params.idx);
  const { name, category, difficulty } = req.body;
  if (!name || !category || !difficulty) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  if (idx < 0 || idx >= exercises.length) {
    return res.status(404).json({ error: 'Exercício não encontrado' });
  }
  exercises[idx] = { name, category, difficulty };
  res.json({ message: 'Exercício editado', exercises });
});
app.delete('/exercises/:idx', (req, res) => {
  const idx = parseInt(req.params.idx);
  if (idx < 0 || idx >= exercises.length) {
    return res.status(404).json({ error: 'Exercício não encontrado' });
  }
  exercises.splice(idx, 1);
  res.json({ message: 'Exercício excluído', exercises });
});

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Listar registros de exercícios
 *     responses:
 *       200:
 *         description: Lista de registros
 */
app.get('/records', (req, res) => {
  res.json(records);
});

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Registrar exercício realizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               day:
 *                 type: string
 *               duration:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Registro adicionado
 */
app.post('/records', (req, res) => {
  const { name, category, difficulty, day, duration } = req.body;
  if (!name || !category || !difficulty || !day || !duration) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  records.push({ name, category, difficulty, day, duration, date: new Date().toISOString() });
  res.json({ message: 'Registro adicionado', records });
});

/**
 * @swagger
 * /progress:
 *   get:
 *     summary: Progresso do usuário
 *     responses:
 *       200:
 *         description: Dados de progresso
 */
app.get('/progress', (req, res) => {
  const totalExercises = records.length;
  const totalTime = records.reduce((acc, r) => acc + r.duration, 0);
  res.json({ totalExercises, totalTime });
});

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
  console.log('Swagger disponível em http://localhost:3000/api-docs');
});
