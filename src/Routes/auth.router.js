import { Router, json, urlencoded } from "express";
import passport from "passport";
import authenticate from "../middlewares/authenticate.js";
import {authController} from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", authController.registerAuthController);

authRouter.post("/login", authController.loginAuthController);

authRouter.get("/current", authenticate("jwt"), authController.currentAuthController);

/*  -autenticacion con github strategy.
    -la idea es modificar la estrategia para utilizar JWT y asi evitar utilizar session.
    -tengo que modificar el middleware authenticate.
*/

authRouter.get("/github", passport.authenticate("github", { scope: ["user: email"]}),authController.gitLogAuthController);

authRouter.get("/github-callback", authenticate("github", { failureRedirect: "/api/sessions/Register-Failure"}), authController.gitFailAuthController);

//logOut de usuario
authRouter.get("/logout", authController.logOutAuthController);

export default authRouter;