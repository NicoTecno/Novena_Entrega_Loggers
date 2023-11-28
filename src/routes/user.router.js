import { Router } from 'express';
import userService from '../services/user.service.js';
import { encriptPass, comparePass } from '../tools/encrypt.js';
import config from '../tools/config.js';
import { userRepository } from '../repositories/index.js';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
	const userData = { 
		...req.body, 
		password: encriptPass(req.body.password),
		cart: [],
	};
	try {
		req.logger.info('Creating new user');

		const newUser = await userRepository.createUser(userData);

		req.logger.info('User created successfully');

		res.status(201).json(newUser);
	} catch (error) {
		req.logger.error(`Error creating user: ${error.message}`);
		res.status(400).json({ error: error.message });
	}
});

const admin = {
	email: config.adminUser,
	password: config.adminPassword
}




usersRouter.post('/auth', async (req, res) => {
	const { email, password } = req.body;
	try {
		req.logger.info('Authenticating user');

		const user = await userRepository.getByEmail(email);

		if (email !== admin.email || password !== admin.password) {
		
			if (!user) throw new Error('Invalid data'); // Comprobo si existe el usuario
			if (!comparePass(user, password)) throw new Error('Invalid data'); // Comprobo si la contraseña coincide
	
			req.logger.info('User authenticated successfully');

			// Guardo la session
			req.session.user = user;

			res.redirect('/');


		} else {

			req.logger.info('Admin authenticated successfully');

			const user = admin.email

			// Guardo la session
			req.session.user = user
			req.session.admin = true

			res.redirect('/');
		}


	} catch (error) {
		req.logger.error(`Authentication failed: ${error.message}`);
		res.status(400).json({ error: error.message });
	}
});

usersRouter.post('/logout', (req, res) => {
	req.logger.info('User logged out');

	req.session.destroy();

	res.redirect('/login');
});

export default usersRouter;
