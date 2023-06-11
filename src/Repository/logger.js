import { enviromentOptions } from "../Config/enviroment.options.js";
import winston from "winston";
import {__dirname} from "../utils.js";
import path from "path";

const currentEnv = enviromentOptions.devEnviroment.node_env;

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors:{
        fatal: "red",
        error: "yellow",
        warning: "magenta",
        info: "blue",
        http: "green",
        debug: "cyan"
    }
};

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "debug",
        format: winston.format.combine(
            winston.format.colorize({colors: customLevels.colors}),
            winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}), //
            winston.format.simple(),
        )
    }) // loggear solo en consola   
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "info",
        format: winston.format.combine(
            winston.format.colorize({colors: customLevels.colors}),
            winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
            winston.format.simple(), 
        )
    }), new winston.transports.File({ filename: path.join(__dirname,"/logs/errors.log"), level: "error" })  
    ]
});
//creo el middleware

export const addLogger = (req,res,next)=>{ // no lo utilizo porque anula las respuestas del controller
    if(currentEnv == "development"){
        req.logger = devLogger;
    }else{
        req.logger = prodLogger;
    }
    req.logger.http(`${req.url} - method: ${req.method}`);
    next(); 
};

export const currentLogger = ()=>{ // para utilizarlo en los service y los manager
    let current;
    if(currentEnv == "development"){
        current = devLogger;
    }else{
        current = prodLogger;
    }
    return current;
};