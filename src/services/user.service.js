import UserDto from '../DTOs/UserDto.js';
import UserRepository from '../repositories/user.repository.js';


class UserService {
	constructor() {
		this.repository = new UserRepository();
	}

	async populateProductCart(userId) {
		const user = await this.repository.findById(userId);
		return new UserDto(
			user.first_name,
			user.last_name,
			user.email,
			user.age,
			user.rol,
			user.cart,
			user.img
		);
	}

	async updateUser(user) {
		await this.repository.save(user);
		return await this.populateProductCart(user._id);
	}

	async getAll() {
		const users = await this.repository.getAll();
		return users.map(user => new UserDto(
			user.first_name,
			user.last_name,
			user.email,
			user.age,
			user.rol,
			user.cart,
			user.img
		));
	}
}

const userService = new UserService();
export default userService;
