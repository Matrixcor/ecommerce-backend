import { Router, json, urlencoded } from "express";

const loggerRouter = Router();

loggerRouter.get("/loggerTest", (req,res)=>{
    req.logger.debug('nivel Debug');
    req.logger.http("nivel Http");
    req.logger.info("nivel Info");
    req.logger.warning("nivel Warning");
    req.logger.error("nivel Error");
    req.logger.fatal("nivel Fatal");
    res.send("Prueba de niveles");
});

export default loggerRouter;