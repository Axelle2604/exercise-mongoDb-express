const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const {
  listProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = require('./services/mongo.js');

app.get('/', async (req, res) => {
  const { page, order, cat } = req.query;
  const results = await listProducts(order, cat, Number(page));
  res.json(results);
});

app.post('/', async (req, res) => {
  const result = req.body;
  await addProduct(result);
  res.sendStatus(201);
});

app.put('/:productId', async (req, res) => {
  const id = req.params.productId;
  const result = req.body;
  await updateProduct(id, result);
  res.sendStatus(200);
});

app.delete('/:productId', async (req, res) => {
  const id = req.params.productId;
  await deleteProduct(id);
  res.sendStatus(200);
});

const server = app.listen(8080, (req, res) => {
  console.log(`Server started at ${server.address().port}`);
});
