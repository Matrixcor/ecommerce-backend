import { Router, json, urlencoded } from "express";
import { productsController } from "../Controllers/products.controller.js";
import checkRole  from "../middlewares/roles.js";
import authenticate from "../middlewares/authenticate.js";
import {dataStorage} from "../utils.js"
const productsRouter = Router();

productsRouter.use(urlencoded({extended: true}));
productsRouter.use(json());


productsRouter.get("/", checkRole(["user"]), productsController.getProdController);

productsRouter.get("/:pid", productsController.getProdByIdController);

productsRouter.post("/",dataStorage.single("file"), productsController.addProdController); //solo administrador

productsRouter.put("/:pid", productsController.updateProdController); //solo administrador

productsRouter.delete("/:pid",  productsController.deleteProdController); //solo administrador

export default productsRouter;