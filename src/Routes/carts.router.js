import { Router, json } from "express";
import { newCartController, getProdCart, addProdCartController, delProdCartController, delAllProdCartController } from "../Controllers/carts.controller.js";

const cartsRouter = Router();
cartsRouter.use(json()); 

cartsRouter.post("/", newCartController);

cartsRouter.get("/:cid", getProdCart);

cartsRouter.post("/:cid/product/:pid", addProdCartController);

cartsRouter.delete("/:cid/products/:pid", delProdCartController);

cartsRouter.delete("/:cid", delAllProdCartController);

export default cartsRouter;