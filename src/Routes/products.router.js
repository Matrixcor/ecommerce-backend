import { Router, json, urlencoded } from "express";
import { productsController } from "../Controllers/products.controller.js";
import {checkRole}  from "../middlewares/roles.js";
import authenticate from "../middlewares/authenticate.js";
import {dataStorage} from "../utils.js"
const productsRouter = Router();

productsRouter.use(urlencoded({extended: true}));
productsRouter.use(json());


productsRouter.get("/", productsController.getProdController);

productsRouter.get("/:pid", productsController.getProdByIdController); // authenticate("jwt")

productsRouter.post("/",dataStorage.single("file"), checkRole(["admin"]), productsController.addProdController); //solo administrador, authenticate("jwt")

productsRouter.put("/:pid", authenticate("jwt"), checkRole(["admin"]), productsController.updateProdController); //solo administrador

productsRouter.delete("/:pid", authenticate("jwt"), checkRole(["admin"]), productsController.deleteProdController); //solo administrador

export default productsRouter;