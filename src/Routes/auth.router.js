import { Router, json, urlencoded } from "express";
import passport from "passport";
import authenticate from "../middlewares/authenticate.js";
import {authController} from "../Controllers/auth.controller.js";
import { profileUploader } from "../utils.js";

const authRouter = Router(); 

authRouter.post("/register", profileUploader.single("avatar"), authController.registerAuthController);

authRouter.post("/login", authController.loginAuthController);

authRouter.get("/current", authenticate("jwt"), authController.currentAuthController);

authRouter.get("/github", passport.authenticate("github", { scope: ["user: email"]}),authController.gitLogAuthController);

authRouter.get("/github-callback", authenticate("github", { failureRedirect: "/api/sessions/Register-Failure"}), authController.gitFailAuthController);

//logOut de usuario
authRouter.get("/logout", authenticate("jwt"), authController.logOutAuthController);

export default authRouter;