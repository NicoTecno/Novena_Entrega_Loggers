import userService from "../../services/user.service.js";

async function removeFromCart(userId, productId) {
    alert("Removing")
    // Encuentra al usuario por su ID
    const user = await userService.getById(userId);
    console.log("Eliminar el producto");

    // Filtra los productos en el carrito para excluir el producto que deseas eliminar
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);

    // Guarda el usuario con el carrito actualizado
    await user.save();
}
