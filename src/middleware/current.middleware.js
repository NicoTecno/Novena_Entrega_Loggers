export function filterCurrent(req, res, next) {
    if (req.session.user) {
        let userCopy = { ...req.session.user };
        
        //eliminar informacion sensible
        delete userCopy.password;
        delete userCopy._id;
        delete userCopy.email;
        delete userCopy.cart;

        req.session.user = userCopy;
    }
    next();
}