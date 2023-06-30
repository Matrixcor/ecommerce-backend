
import {__dirname} from "../utils.js";
import swaggerJsdoc from "swagger-jsdoc";
import { path } from "path";

const swaggerOptions ={
    definition:{
        openapi: "3.0.1",
        info:{
            title: "Documentacion de la aplicacion Ecommerce-BackEnd",
            description:"API elaborada para l acomercializacion de productos a traves de la red"
        }
    },
    apis:[`${path.join(__dirname, "../Docs/**/*.yaml")}`]
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);