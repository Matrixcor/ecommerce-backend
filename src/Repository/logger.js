import { enviromentOptions } from "../Config/enviroment.options.js";
import winston from "winston";
import {__dirname} from "../utils.js";
import path from "path";

const currentEnv = enviromentOptions.devEnviroment.node_env;

const customLevels = {
    levels: {
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0
    },
    colors:{
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'orange',
        fatal: 'red'
    }
}


const devLogger = winston.createLogger({
    level: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "debug",
        format: winston.format.combine(
            winston.format.colorize({color: customLevels.colors}),
            winston.format.simple()
        )
    }) // loggear solo en consola   
    ]
});


const prodLogger = winston.createLogger({
    level: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "info",
        format: winston.format.combine(
            winston.format.colorize({colors: customLevels.colors}),
            winston.format.simple()
        )}), // loogear solo a partir de nivel info
        new winston.transports.File({ filename: path.join(__dirname,"logs/errors.log"), level: "error" })
    ]
});
//creo el middleware

export const addLogger = (req,res,next)=>{
    if(currentEnv == "development"){
        req.logger = devLogger;
    }else{
        req.logger = prodLogger;
    }
    req.logger.http(`${req.url} - method: ${req.method}`);
    next(); 
}