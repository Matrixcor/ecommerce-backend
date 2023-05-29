import { Router, json } from "express";
import { cartController } from "../Controllers/carts.controller.js";

const cartsRouter = Router();
cartsRouter.use(json()); 

cartsRouter.post("/", cartController.newCartController); //deberia colocar un middleware para ver si esta loggeado para crear el cart y pasar los datos del token

cartsRouter.get("/:cid", cartController.getProdCart);

cartsRouter.post("/:cid/products/:pid", cartController.addProdCartController); //solo el usuario

cartsRouter.delete("/:cid/products/:pid", cartController.delProdCartController); //solo el usuario

cartsRouter.delete("/:cid", cartController.delAllProdCartController); //solo el usuario

cartsRouter.post("/:cid/purchase", cartController.purchaseCartController); //finaliza proceso de compra
/*debo corroborar el stock antes de finalizar:
-si hay stock: restarlo del stock de la db
-sin no hay stock, no agrego el producto a la compra( lo quito)
*/

export default cartsRouter;