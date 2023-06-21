import { Router, json, urlencoded } from "express";
import { productsController } from "../Controllers/products.controller.js";
import {checkRole}  from "../middlewares/roles.js";
import authenticate from "../middlewares/authenticate.js";
import {dataStorage} from "../utils.js"
const productsRouter = Router();

productsRouter.use(urlencoded({extended: true}));
productsRouter.use(json());


productsRouter.get("/", productsController.getProdController);

productsRouter.get("/:pid", productsController.getProdByIdController); // authenticate("jwt") , checkRole(["admin"]) quite la autenticaciones para probar directamente

productsRouter.post("/", dataStorage.single("file"), authenticate("jwt"), checkRole(["admin", "premium"]), productsController.addProdController); //solo administrador y premium

productsRouter.put("/:pid", authenticate("jwt"), checkRole(["admin"]), productsController.updateProdController); //solo administrador

productsRouter.delete("/:pid", authenticate("jwt"), checkRole(["admin", "premium"]), productsController.deleteProdController); //solo administrador borra todo tipo de producto, premium solo los que le pertenece

export default productsRouter;