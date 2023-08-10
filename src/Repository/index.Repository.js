import { connProdDao, connAuthDao, connCartDao, connTicketDao, connUserDao } from "../Dao/factory.js";

import { userRepository } from "./user.Repository.js";
import { authRepository } from "./auth.Repository.js";
import { productRepository } from "./product.Repository.js";
import { cartRepository } from "./cart.Respository.js"
import { viewsRepository } from "./views.Repository.js"
import { ticketRepository } from "./ticket.Repository.js";

export const userServices = new userRepository(connUserDao);
export const authServices = new authRepository(connAuthDao);
export const productServices = new productRepository(connProdDao);
export const ticketServices = new ticketRepository(connTicketDao);

export const cartServices = new cartRepository(connCartDao);
export const viewServices = new viewsRepository(connProdDao);