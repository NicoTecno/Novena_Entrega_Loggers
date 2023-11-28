// Dependencies
import mongoose from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import productController from './controllers/product.controller.js';


//middleware
import { isAdmin } from './middleware/auth.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';

//passport
import incializePassport from './config/passport.confg.js';

//data
// import dataProducts from './data/products.json' assert {type: 'json'};

//model
import productModel from './DAOs/models/products.model.js';

//routes
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js';
import viewsCartsRouter from './routes/views.cart.router.js'
import productsRouter from './routes/products.router.js';
import realTimeProductsRouter from './routes/realTimeProducts.router.js';
import chatRouter from './routes/chat.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/user.router.js';
import profileRouters from './routes/profile.router.js';
import mockingRouters from './routes/mocking.router.js';

import loggerTest from './routes/logger.test.router.js'

// Config
import config from './tools/config.js';
import mailingRoutes from './routes/mailing.js';

const app = express();
const port = 8080;

app.use(loggerMiddleware);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./src/public'));

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

//Coockies
app.use(cookieParser(config.secret));

// Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:
				config.mongoUrl,
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: config.secret,
		resave: true,
		saveUninitialized: true,
	})
);

mongoose.set("strictQuery", false);
try {
    await mongoose.connect(config.mongoUrl);
} catch {
    console.error(`Database connection failed: ${error}`);
};

incializePassport();

app.use("/", profileRouters);

// api
app.use('/api/sessions', sessionsRouter);

app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//app.use(express.static('public'));

//insert product data if necessary1

// try {
//     await productModel.insertMany(dataProducts);
// } catch (err) {
//     console.log(`error al insertar data: ${err} `);
// }


const httpServer = app.listen(port, () => {
    console.log(`Escuchando por el puerto ${port}`);
});
const socketServer = new Server(httpServer);

//Routers
app.use("/products", profileRouters);
app.use("/carts", viewsCartsRouter);
app.use('/realTimeProducts', realTimeProductsRouter(socketServer));
app.use("/chat", chatRouter(socketServer));
app.use("/mockingproducts", mockingRouters);

app.use("/loggerTest", loggerTest)


//mailing
app.use('/api/sending', mailingRoutes)