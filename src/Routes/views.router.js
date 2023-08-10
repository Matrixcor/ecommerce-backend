import { Router, json } from "express";
import passport from "passport";
import authenticate from "../middlewares/authenticate.js";
import { checkRole } from "../middlewares/roles.js";
import { viewsController } from "../Controllers/views.controller.js";

const viewsRouter = Router();
viewsRouter.use(json());

// vista de carrito
viewsRouter.get("/carts/:cid", viewsController.cartProdViewController); //muestro el carrito

viewsRouter.get("/:cid/purchase", authenticate("jwt"), viewsController.purchaseWebViewController); // si tengo autorizacion o si estoy loggeado

viewsRouter.get("/:cid/ticket", authenticate("jwt"), viewsController.ticketViewController);


viewsRouter.get("/", viewsController.homeViewController);

viewsRouter.get("/products", authenticate("jwt"), viewsController.prodsViewController);

viewsRouter.get("/login", viewsController.loginViewController);

viewsRouter.get("/register", viewsController.registerViewController);

viewsRouter.get("/profile", authenticate("jwt"), viewsController.profileViewController);

viewsRouter.get("/control-panel", authenticate("jwt"), checkRole(["admin"]), viewsController.panelViewController);

//esto verlo si va o no

viewsRouter.get("/profile/create",authenticate("jwt"), viewsController.profileCreateViewController); //create producst

viewsRouter.get("/profile/delete",authenticate("jwt"), viewsController.profileDeleteViewController); //delete products

export default viewsRouter;