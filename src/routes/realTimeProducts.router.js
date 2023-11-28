import { Router } from 'express';
const router = Router();
import productController from '../controllers/product.controller.js';
import { isAdmin } from '../middleware/auth.middleware.js';

// custom errors
import CustomErrors from '../tools/CustomErrors.js';
import EErrors from '../tools/EErrors.js';
import { ProductErrorInfo } from '../tools/EErrorInfo.js';

//logger
import logger from '../middleware/logger.middleware.js';

const realTimeProductsRouter = (socketServer) => {

    socketServer.on('connection', async (socket) => {
        logger.debug(`New connection: ${socket.id}`);
        // Load products
        try {
            const products = await productController.getProducts();
            await socketServer.emit('products', products);
        } catch (error) {
            logger.error(`Error has been occurred trying to load the products: ${error}`);
        };

        // Create Products
        socket.on('newProduct', async (newProduct) => {
            try {
                await productController.addProduct(newProduct);
                const products = await productController.getProducts();
                await socketServer.emit('products', products);
            } catch (error) {
                CustomErrors.createError(
                    "error creating products",
                    ProductErrorInfo(newProduct),
                    EErrors.PRODUCT_ERROR
                );
                logger.error(`Error has been occurred trying to create a product: ${error}`);
            };
        });

        // Delete Product 
        socket.on('deleteProduct', async (productToDelete) => {
            try {
                await productController.deleteProduct(productToDelete);
                const products = await productController.getProducts();
                await socketServer.emit('products', products);
            } catch (error) {
                logger.error(`Error has been occurred trying to delete a product: ${error}`);
            };
        });
    });

    // Render view
    router.get('/', isAdmin, (req, res) => {

        res.status(200).render('realTimeProducts', {
            script: 'realTimeProducts',
            style: 'realtimeProducts',
            title: 'Productos en tiempo real',
            
        });

    });


    return router;
};

export default realTimeProductsRouter;