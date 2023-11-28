import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import userServices from '../services/user.service.js';
import config from '../tools/config.js';
import { userRepository } from '../repositories/index.js';

const clientID = config.clientId;
const clientSecret = config.clientSecret;

const incializePassport = () => {
	passport.use(
		'github',
		new GitHubStrategy(
			{
                // agregar datos
				clientID: clientID,
				clientSecret: clientSecret,
				callbackURL:
					'http://localhost:8080/api/sessions/githubcallback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					//console.log(profile);
					let user = await userRepository.getByEmail(
						profile._json.email
					);

					if (!user) {
						let newUser = {
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							img: profile._json.avatar_url,
						};
						user = await userRepository.createUser(newUser);

						done(null, user);
					} else {
						done(null, user);
					}
				} catch (error) {
					done(error, false);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		const user = await userServices.getById(id);
		done(null, user);
	});
};

export default incializePassport;
