import productRepository from '../repositories/products.repository.js';

class ProductService {
	constructor() {
		this.repository = productRepository;
	}

	async getById(id) {
		const product = await this.repository.getById(id);
		return product; // Este será un objeto de tipo ProductDto
	}

	
}

const productService = new ProductService();
export default productService;
