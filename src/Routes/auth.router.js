import { Router, json, urlencoded } from "express";
import passport from "passport";
import authenticate from "../middlewares/authenticate.js";
import { registerAuthController, loginAuthController, currentAuthController, gitLogAuthController, 
        gitFailAuthController, logOutAuthController } from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerAuthController);

authRouter.post("/login", loginAuthController);

authRouter.get("/current", authenticate("jwt"), currentAuthController);

/*  -autenticacion con github strategy.
    -la idea es modificar la estrategia para utilizar JWT y asi evitar utilizar session.
    -tengo que modificar el middleware authenticate.
*/

authRouter.get("/github", passport.authenticate("github", 
    { scope: ["user: email"]}),
   gitLogAuthController
);

authRouter.get("/github-callback", authenticate("github", { failureRedirect: "/api/sessions/Register-Failure"}),
    gitFailAuthController
);

//logOut de usuario

authRouter.get("/logout", logOutAuthController);

export default authRouter;