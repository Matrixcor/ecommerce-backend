import { Router, json } from "express";
import { cartController } from "../Controllers/carts.controller.js";
import {checkRole}  from "../middlewares/roles.js";
import authenticate from "../middlewares/authenticate.js";

const cartsRouter = Router();
cartsRouter.use(json()); 

cartsRouter.post("/", cartController.newCartController); //deberia colocar un middleware para ver si esta loggeado para crear el cart y pasar los datos del token

cartsRouter.get("/:cid", cartController.getProdCart);

cartsRouter.post("/:cid/products/:pid", authenticate("jwt"), checkRole(["admin", "premium"]), cartController.addProdCartController); //los premiun no pueden agregar sus propios productos al carrito

cartsRouter.delete("/:cid/products/:pid", cartController.delProdCartController); //solo el usuario

cartsRouter.delete("/:cid", cartController.delAllProdCartController); //solo el usuario

cartsRouter.post("/:cid/purchase", cartController.purchaseCartController); //finaliza proceso de compra

export default cartsRouter;