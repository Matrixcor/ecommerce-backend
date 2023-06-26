import { Router, json, urlencoded } from "express";
import passport from "passport";
import authenticate from "../middlewares/authenticate.js";
import { checkRole } from "../middlewares/roles.js";
import { userController } from "../Controllers/users.controller.js";
const usersRouter = Router();

usersRouter.get("/premium/:uid",authenticate("jwt"), userController.changeRoleController); //solo los admin pueden cambiar los roles, checkRole(["admin"]),

export default usersRouter;