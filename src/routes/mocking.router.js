import { Router } from 'express';
import { faker } from '@faker-js/faker';
import { isAuth, isGuest } from '../middleware/auth.middleware.js';

const mockingRouters = Router();

// Función para generar los productos ficticios
const generateProducts = () => {
    let numOfProducts = Math.floor(Math.random() * (30 - 26 + 1)) + 10;
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push({
            id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            stock: Math.floor(Math.random() * 6),
            category: "AAA",
            thumbnail: faker.image.url(),
        });
    }
    return products;
};

// Función para obtener los productos paginados y ordenados
const getProducts = (limit, page, sort, query) => {
    const allProducts = generateProducts();
    const formatLimit = limit ? Number(limit) : 4;
    const formatPage = page ? Number(page) : 1;

    let formattedProducts = allProducts;
    if (query) {
        req.logger.error(`Filter by Query`);
        formattedProducts = allProducts.filter((product) => product.category === query);
    }

    // Aplica el ordenamiento según el valor de sort
    if (sort === 'asc') {
        formattedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
        formattedProducts.sort((a, b) => b.price - a.price);
    } else if (sort && sort !== 'asc' && sort !== 'desc') {
        throw new Error('Error: Bad Request, just admit asc and desc');
    }

    const totalProducts = formattedProducts.length;
    const totalPages = Math.ceil(totalProducts / formatLimit);

    // Calcula el índice inicial y final para paginación
    const startIndex = (formatPage - 1) * formatLimit;
    const endIndex = Math.min(startIndex + formatLimit, totalProducts);

    const paginatedProducts = formattedProducts.slice(startIndex, endIndex);

    return {
        products: paginatedProducts,
        totalPages,
        currentPage: formatPage,
        pageSize: formatLimit,
    };
};

mockingRouters.get('/', isAuth, async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;

        // Obtén los productos paginados utilizando la función getProducts
        const productsData = getProducts(limit, page, sort, query);

        const { user } = req.session;
        delete user.password;

        let products = productsData.products;
        products.prevLink = productsData.currentPage > 1 ? `/mockingproducts?page=${productsData.currentPage - 1}` : null;
        products.nextLink = productsData.currentPage < productsData.totalPages ? `/mockingproducts?page=${productsData.currentPage + 1}` : null;
        products.hasNextPage = productsData.currentPage < productsData.totalPages;
        products.hasPrevPage = productsData.currentPage > 1;

        if (productsData.totalPages > 1) {
            products.totalPagesArray = Array.from({ length: productsData.totalPages }, (_, i) => i + 1);
        }

        res.status(200).render('mockingproducts', {
            script: 'index',
            style: 'index',
            title: 'Productos',
            products,
            user,
            currentPage: productsData.currentPage,
            totalPages: productsData.totalPages,
            prevLink: products.prevLink,
            nextLink: products.nextLink,
            totalPagesArray: products.totalPagesArray,
        });

    } catch (error) {
        req.logger.error(`Error trying to fetch all the products: ${error}`)
        res.status(500).send(`Error trying to fetch all the products: ${error}`);
    }
});

// ...

export default mockingRouters;
