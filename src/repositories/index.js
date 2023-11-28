import UserRepository from "./user.repository.js";
import TicketRepository from "./tickets.repository.js";
import ProductRepository from "./products.repository.js";

export const productRepository = new ProductRepository();
export const userRepository = new UserRepository();
export const ticketsRepository = new TicketRepository();

