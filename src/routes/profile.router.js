import { Router } from 'express';
import { isAuth, isGuest } from '../middleware/auth.middleware.js';

import productController from '../controllers/product.controller.js';

//custom erros
import EErrors from '../tools/EErrors.js';
import CustomErrors from '../tools/CustomErrors.js';
import { ProductErrorInfo, DatabaseErrorInfo } from '../tools/EErrorInfo.js';


const profileRouters = Router();

profileRouters.get('/', isAuth, (req, res) => {
    try {
        const { user } = req.session;
        delete user.password;

        res.render('index', {
            title: 'Perfil de Usuario',
            user
        });
    } catch {
        CustomErrors.createError(
            "error accessing route",
            UserErrorInfo(req.session.user),
            "error accessing route",
            EErrors.ROUTING_ERROR
        );
        req.logger.error(`Error accessing user profile route: ${error}`);

    }
});

profileRouters.get('/register', isGuest, (req, res) => {
    res.render('register', {
        style: 'style',
        title: 'Registrar Nuevo Usuario',
    });
});

profileRouters.get('/login', isGuest, (req, res) => {
    res.render('login', {
        style: 'style',
        title: 'Inicio de Sesión',
    });
});



profileRouters.get('/products', isAuth, async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const products = await productController.getProducts(limit, page, sort, query);

        const { user } = req.session;
        delete user.password;

        products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}` : null;

        if (products.totalPages > 1) {
            products.totalPagesArray = [];
            for (let i = 1; i <= products.totalPages; i++) {
                products.totalPagesArray.push(i);
            };
        };
        res.status(200).render('products', {
            script: 'index',
            style: 'index',
            title: 'Productos',
            products: products,
            user
        });

    } catch (error) {
        CustomErrors.createError(
            "error fetching products",
            DatabaseErrorInfo(error),
            "error fetching products",
            EErrors.DATABASE_ERROR
        );
        req.logger.error(`Error fetching products: ${error}`);
    };
});



profileRouters.get('/products/:pid', async (req, res) => {
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
            "error fetching product by id",
            ProductErrorInfo({ id: pid }),
            "error fetching product by id",
            EErrors.PRODUCT_ERROR
        );
        req.logger.error(`Error fetching product by id: ${error}`);
    };
})

export default profileRouters;
