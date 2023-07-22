import { Router, json, urlencoded } from "express";
import passport from "passport";
import authenticate from "../middlewares/authenticate.js";
import { checkRole } from "../middlewares/roles.js";
import { userController } from "../Controllers/users.controller.js";
import { documentsUploader } from "../utils.js";

const usersRouter = Router();

usersRouter.get("/premium/:uid", authenticate("jwt"), userController.changeRoleController); //solo los admin pueden cambiar los roles
usersRouter.post("/:uid/documents", authenticate("jwt"), documentsUploader.fields([
        {name: "identificacion", maxCount: 1}, 
        {name: "comprobante-domicilio", maxCount: 1}, 
        {name: "comprobante-cuenta", maxCount: 1}
    ]), userController.uploadDocsController
);

export default usersRouter;