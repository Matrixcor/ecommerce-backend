import { Router, json, urlencoded } from "express";
import { productsController } from "../Controllers/products.controller.js";
import {checkRole}  from "../middlewares/roles.js";
import authenticate from "../middlewares/authenticate.js";
import { productUploader } from "../utils.js"

const productsRouter = Router();

productsRouter.use(urlencoded({extended: true}));
productsRouter.use(json());


productsRouter.get("/", productsController.getProdController);

productsRouter.get("/:pid", productsController.getProdByIdController); //authenticate("jwt")  quite la autenticaciones para probar directamente

productsRouter.post("/", productUploader.single("prodImg"), authenticate("jwt"), checkRole(["admin", "premium"]), productsController.addProdController); //solo administrador y premium authenticate("jwt"), checkRole(["admin", "premium"]),

productsRouter.put("/:pid", authenticate("jwt"), checkRole(["admin"]), productsController.updateProdController);

productsRouter.delete("/:pid", authenticate("jwt"), checkRole(["admin", "premium"]), productsController.deleteProdController);

export default productsRouter;