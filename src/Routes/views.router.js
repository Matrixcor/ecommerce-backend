import { Router, json } from "express";
import passport from "passport";
import authenticate from "../middlewares/authenticate.js";
import { checkRole } from "../middlewares/roles.js";
import { viewsController } from "../Controllers/views.controller.js";

const viewsRouter = Router();
viewsRouter.use(json()); 

viewsRouter.get("/", viewsController.homeViewController);

viewsRouter.get("/chat", authenticate("jwt"), checkRole(["user"]) , viewsController.chatViewController); //solo el rol user

viewsRouter.get("/carts/:cid", viewsController.cartProdViewController);

// vistas webs
viewsRouter.get("/mockingproducts", viewsController.mockingProdsController);

viewsRouter.get("/products", authenticate("jwt"), viewsController.prodsViewController);

viewsRouter.get("/:cid/purchase", authenticate("jwt"), viewsController.purchaseWebViewController); // si tengo autorizacion o si estoy loggeado

viewsRouter.get("/:cid/ticket", authenticate("jwt"), viewsController.ticketViewController);

viewsRouter.get("/login", viewsController.loginViewController);

viewsRouter.get("/register", viewsController.registerViewController);

viewsRouter.get("/recovery", viewsController.recoveryViewController); // se renderiza primero y cargo el email para hacer el token

viewsRouter.get("/restore", viewsController.restoreViewController); //renderizo el formulario que redirigio el email para enviar datos de email y nueva password al endpoint

viewsRouter.get("/profile", authenticate("jwt"), viewsController.profileViewController);

viewsRouter.get("/profile/create",authenticate("jwt"), viewsController.profileCreateViewController);

viewsRouter.get("/profile/delete",authenticate("jwt"), viewsController.profileDeleteViewController);

export default viewsRouter;