export default class CartDto {
    constructor(products) {
      this.products = products.map(product => ({
        product: product.product,
        quantity: product.quantity,
      }));
    }
  }
  