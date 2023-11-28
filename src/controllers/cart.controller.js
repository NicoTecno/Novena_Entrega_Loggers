import cartsModel from "../DAOs/models/carts.model.js"
import CartDto from "../DTOs/CartDto.js";

class CartController {
  // Get
  getCarts = async () => {
    try{
      const carts = await cartsModel.find().populate("products.product");
      return carts.map(cart => new CartDto(cart.products));
    } catch (error){
      console.error(`Error trying to bring carts: ${error}`);
    };
  };

  // Get by id
  getCartById = async (id) => {
    try {
      const cart = await cartsModel.findById(id).lean().populate("products.product");
      return new CartDto(cart.products);
    } catch (error){
      console.error(`Error trying to bring cart by id: ${error}`);
    };
  };

  // Create cart
  addCart = async (cart) => {
    const idProduct = cart.product.trim();
    const quantityProduct = Number(cart.quantity);
    
    if(quantityProduct < 1 || idProduct.length < 1) return;
    
    const formattedCart = {
      products: [{ product: idProduct, quantity: quantityProduct }]
    };

    try {
      const newCart = new cartsModel(formattedCart);
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error(`Error trying to create the cart: ${error}`);
    };
  };

  // Add product to cart
  addProduct = async (cid, pid) => {
    const newProduct = { product: pid, quantity: 1 };
    try {
      const cart = await cartsModel.findById(cid);
      const indexProduct = cart.products.findIndex((item) => item.product == pid);

      if (indexProduct < 0) {
        cart.products.push(newProduct);
      } else {
        cart.products[indexProduct].quantity += 1;
      };

      await cart.save();
      return cart;
    } catch (error){
      console.error(`Error trying to add product to the cart: ${error}`);
    };
  };

  // Delete product of cart
  deleteProductOfCart = async (cid, pid) => {
    try {
      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
      ).populate("products.product");

      if (updatedCart) {
        return updatedCart;
      } else {
        return 'Product not found in the cart.';
      };

    }catch(error){
      console.error(`Error trying to delete a product from the cart: ${error}`);
    };
  };

  
  deleteAllProductsOfCart = async (cid) => {
    try {
      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] } },
        { new: true }
      ).populate("products.product");

      if (updatedCart) {
        return updatedCart;
      } else {
        return 'No products found in the cart.';
      }

    } catch (error) {
      console.error(`Error trying to delete all products from the cart: ${error}`);
    };
  };

  updateAllProducts = async (cid, products) => {
    try {
      await this.deleteAllProductsOfCart(cid);
      await products.forEach((product) => {
        this.addProduct(cid, product.id);
      });

      return this.getCartById(cid);
    } catch (error) {
      console.error(`Error trying to update all products from the cart: ${error}`);
    };
  };


  updateQuantity = async (cid, pid, updatedQuantity) => {
    try {
      const currentCart = await this.getCartById(cid);
      const indexProduct = currentCart.products.findIndex((item) => item.product.toString() === pid);
  
      if (indexProduct !== -1) {
        currentCart.products[indexProduct].quantity = updatedQuantity;
        await currentCart.save();
        return currentCart;
      } else {
        return 'Product not found on cart'
      }
    } catch (error) {
      console.error(`Error trying to update product quantity: ${error}`);
    }
  };

};

const cartController = new CartController();

export default cartController;