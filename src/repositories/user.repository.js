import userModel from '../DAOs/models/user.model.js';

export default class UserRepository {
    async findById(userId) {
        return await userModel.findById(userId).populate('cart.productId').lean();
    }

    async save(user) {
        user.markModified('cart');
        return await user.save();
    }

    async getAll() {
        return await userModel.find();
    }

    async getCartUser(userId) {
        return await userModel.findOne({ _id: userId }, { _id: 0, cart: 1 });
    }

    async getByEmail(email) {
        return await userModel.findOne({ email: email });
    }

    async createUser(userData) {
        return await userModel.create(userData);
    }

    async getById(id) {
        return await userModel.findById(id);
    }

    async getByAge(age) {
        return await userModel.findOne({ age: age });
    }
}
