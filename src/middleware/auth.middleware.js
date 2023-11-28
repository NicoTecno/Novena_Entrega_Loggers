export function isAuth(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

export function isAdmin(req, res, next) {
	if(req.session.admin) {
		next()
	}else {
		res.redirect('/');
	}
}


export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/');
	}
}
