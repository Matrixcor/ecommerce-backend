import { Router } from "express";
import passport from "passport";

import { viewsController } from "../Controllers/views.controller.js";

const viewsRouter = Router();

viewsRouter.get("/", viewsController.homeViewController);

viewsRouter.get("/real-time-products", viewsController.realTimeViewController);

viewsRouter.get("/chat", viewsController.chatViewController);

viewsRouter.get("/carts/:cid", viewsController.cartProdViewController);

// vistas webs 

viewsRouter.get("/products", viewsController.prodsViewController);

viewsRouter.get("/login", viewsController.loginViewController);

viewsRouter.get("/register", viewsController.registerViewController);

viewsRouter.get("/profile", passport.authenticate("jwt", {sessions: false}), viewsController.profileViewController);

export default viewsRouter;