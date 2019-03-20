const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
let db = null;

const initializeDatabase = async () => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017', {
      auth: { user: 'admin', password: 'pswd' },
      poolSize: 10,
      useNewUrlParser: true,
    });
    db = client.db('myDb');
    const products = db.collection('products');
  } catch (e) {
    console.error(e);
  }
};

const listProducts = async (param, cat, page) => {
  try {
    const order = param === 'asc' ? 1 : -1;
    const category =
      (cat === 'name' && { name: order }) ||
      (cat === 'description' && { description: order });
    const listProd = await db
      .collection('products')
      .find()
      .sort(category)
      .skip(page * 2)
      .limit(2)
      .toArray();

    return listProd;
  } catch (e) {
    console.error(e);
  }
};

const addProduct = async product => {
  try {
    return await db.collection('products').insertOne(product);
  } catch (e) {
    console.error(e);
  }
};

const deleteProduct = async productId => {
  try {
    await db.collection('products').deleteOne({ _id: ObjectId(productId) });
  } catch (e) {
    console.error(e);
  }
};

const updateProduct = async (productId, elemToChange) => {
  try {
    await db
      .collection('products')
      .updateOne({ _id: ObjectId(productId) }, { $set: elemToChange });
  } catch (e) {
    console.error(e);
  }
};

initializeDatabase().then(() => listProducts('asc', 'description', 1));

module.exports = { listProducts, addProduct, deleteProduct, updateProduct };
