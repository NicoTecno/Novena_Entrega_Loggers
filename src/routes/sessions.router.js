import { Router } from 'express';
import passport from 'passport';
import { filterCurrent } from '../middleware/current.middleware.js';


const sessionsRouter = Router();

sessionsRouter.get('/current', filterCurrent, (req, res) => {
	if(req.session.user){
		req.logger.info('Fetching current authenticated user');
		res.json(req.session.user);
	} else {
		req.logger.error('No authenticated user found');
		res.status(401).json({ messsage: 'No se encontro el usuario autenticado'});
	}
});

sessionsRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	async (req, res) => {
		req.logger.info('Starting GitHub authentication');
	}
);

sessionsRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		if (req.user) {
			req.logger.info('GitHub authentication successful');
			req.session.user = req.user;
		} else {
			req.logger.warning('GitHub authentication failed');
		}
		res.redirect('/');
	}
);

export default sessionsRouter;
