import productModel from '../DAOs/models/products.model.js';
import ProductDto from '../DTOs/ProductsDto.js';

export default class ProductRepository {
    constructor() {
        this.model = productModel;
    }

    async getById(id) {
        return await this.model.findById(id)
    }

}