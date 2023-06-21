import { Router, json, urlencoded } from "express";
import passport from "passport";
import authenticate from "../middlewares/authenticate.js";

const usersRouter = Router();

usersRouter.post("/premium/:uid", ()=>{});

export default usersRouter;