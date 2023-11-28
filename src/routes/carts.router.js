import { Router } from "express";

import cartController from "../controllers/cart.controller.js";
import userService from "../services/user.service.js";
import userModel from "../DAOs/models/user.model.js";

import { userRepository } from "../repositories/index.js";

const router = Router();

// Get carts
router.get('/:userId/cart', async (req, res) => {
  try {
    const carts = await cartController.getCarts();
    res.status(200).json({ carts });
  } catch (error) {
    req.logger.error(`Error trying to get carts: ${error}`);
    res.status(500).send(`Internal server error trying to get carts: ${error}`);
  };
});


router.get('/:userId', async (req, res) => {
  const { user } = req.params.user;
  delete user.password;

  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const currentCart = await cartController.deleteProductOfCart(cid, pid);
    res.status(202).json(currentCart);
  } catch (error) {
    req.logger.error(`Error trying to add a product to cart: ${error}`);
    res.status(500).send(`Internal server error trying to add a product to cart: ${error}`);
  };

});


// add product to cart
router.post('/:userId/cart', async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    let user = await userRepository.getById(userId);

    if (!user) {
      req.logger.error(`User ${userId} does not exist`);
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart.push({ productId, quantity });
    user.markModified('cart');

    await userService.updateUser(user);

    user = await userModel.findById(userId).populate('cart.productId');

    const populatedUser = await userService.populateProductCart(userId);

    // Respond with the populated user.
    res.status(200)
    //.json(populatedUser);

  } catch (error) {
    req.logger.error(error)
    res.status(400).json({ error: error.message });
  }
});



// Update all products of cart
router.put('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedProducts = req.body;
    const currentCart = await cartController.updateAllProducts(cid, updatedProducts);
    res.status(202).json(currentCart);
  } catch (error) {
    req.logger.error(`Error trying to add a product to cart: ${error}`);
    res.status(500).send(`Internal server error trying to add a product to cart: ${error}`);
  };
});



// delete product cart
router.post('/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await userRepository.getById(userId);

    // Filtra los productos en el carrito para excluir el producto que deseas eliminar
    req.logger.debug("Filtro los productos en el carrito");
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);

    // save user
    await user.save();

    const populateUser = await userService.populateProductCart(userId);

    res.status(200).json(populateUser)

    //res.status(204).end();


  } catch (error) {
    req.logger.error(`Error removing product from cart: ${error}`);
    res.status(500).send(`Internal server error removing product from cart: ${error}`);
  }
});


//Delete by post
router.post('/:cid/products/delete/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const currentCart = await cartController.deleteProductOfCart(cid, pid);
    res.status(202).json(currentCart);
  } catch (error) {
    req.logger.error(`Error trying to add a product to cart: ${error}`);
    res.status(500).send(`Internal server error trying to add a product to cart: ${error}`);
  };
});

export default router;