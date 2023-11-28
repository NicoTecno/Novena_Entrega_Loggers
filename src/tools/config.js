import dotenv from 'dotenv';

dotenv.config();

export default {
    ENVIROMENT: process.env.ENVIROMENT,

    mongoUrl: process.env.MONGO_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,

    secret: process.env.SECRET_KEY,

    adminUser: process.env.ADMIN_USER,
    adminPassword: process.env.ADMIN_PASSWORD,
}