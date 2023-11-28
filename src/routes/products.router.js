import { Router } from 'express';
import productController from '../controllers/product.controller.js';

// custom errors
import CustomErrors from '../tools/CustomErrors.js';
import EErrors from '../tools/EErrors.js';
import { ProductErrorInfo } from '../tools/EErrorInfo.js';

const router = Router();

// Get
router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const products = await productController.getProducts(limit, page, sort, query);
    res.status(200).send(products);
  } catch (error) {
    req.logger.error(`Error al obtener productos: ${error}`);
    res.status(500).send(`Error al obtener productos: ${error}`);
  };
});

// Get by ID
router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;


  try {
    const product = await productController.getProductById(pid);
    const { user } = req.session;
    delete user.password;

    res.status(200).render('product', {
      script: 'products',
      style: 'product',
      title: `${product.title}`,
      product,
      user

    });

  } catch (error) {

    CustomErrors.createError(
      "error creating products",
      ProductErrorInfo(error),
      "error creating products",
      EErrors.PRODUCT_ERROR
    );
    req.logger.error(`Error trying to fetch product by id: ${error}`);
  };
});


// Create
router.post("/", async (req, res) => {
  if (!req.body) return;

  try {
    const currentProduct = await productController.addProduct(req.body);
    res.status(201).send({ currentProduct });
  } catch (error) {
    req.logger.error(`Error trying to create a product: ${error}`);
    res.status(500).send(`Error trying to create a product: ${error}`);
  };

});

// Update 
router.put("/:pid", async (req, res) => {
  if (!req.body) return;

  const pid = req.params.pid;
  try {
    const currentProduct = await productController.updateProduct(pid, req.body);
    res.status(201).send({ currentProduct });
  } catch (error) {
    req.logger.error(`Error trying to update a product: ${error}`);
    res.status(500).send(`Error trying to create a product: ${error}`);
  };
});

// Delete
router.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;

  try {
    const deteledProduct = await productController.deleteProduct(pid);
    res.status(200).send(deteledProduct);
  } catch (error) {
    req.logger.error(`Error trying to delete a product: ${error}`);
    res.status(500).send(`Error trying to create a product: ${error}`);
  };
});


export default router;