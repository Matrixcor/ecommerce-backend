
import {__dirname} from "../utils.js";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
    definition:{
        openapi: "3.0.1",
        info:{
            title: "Documentacion de la aplicacion Ecommerce-BackEnd",
            description:"API elaborada para la  comercializacion de productos a traves de la red",
            version: "1.0.0"
        },
        servers: [{url:`http://localhost:8080`}], 
    },
    apis:[`${__dirname}/Docs/**/*.yaml`]
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);