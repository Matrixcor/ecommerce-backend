import { Router, json, urlencoded } from "express";

const loggerRouter = Router();

loggerRouter.get("/loggerTest", (req,res)=>{
    req.logger.fatal("nivel Fatal");
    req.logger.error("nivel Error");
    req.logger.warning("nivel Warning");
    req.logger.info("nivel Info");
    req.logger.http("nivel Http");
    req.logger.debug("nivel Debug");

    res.send("Prueba de niveles");
});

export default loggerRouter;