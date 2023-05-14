import { Router, json, urlencoded } from "express";
import { productsController } from "../Controllers/products.controller.js";
import {dataStorage} from "../utils.js"
import { productService } from "../Services/productService.js";
const productsRouter = Router();

productsRouter.use(urlencoded({extended: true}));
productsRouter.use(json());


productsRouter.get("/", productsController.getProdController);

productsRouter.get("/:pid", productsController.getProdByIdController);

productsRouter.post("/", dataStorage.single("file"), productsController.addProdController);

productsRouter.put("/:pid", productsController.updateProdController);

productsRouter.delete("/:pid", productsController.deleteProdController);

export default productsRouter;