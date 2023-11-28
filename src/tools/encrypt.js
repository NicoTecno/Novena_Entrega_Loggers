import bcrypt from 'bcrypt';

export const encriptPass = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const comparePass = (user, pass) => {
    return bcrypt.compareSync(pass, user.password);
};