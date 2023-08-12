import express from "express";
import { json , urlencoded } from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { __dirname } from "./utils.js";
import viewsRouter from "./Routes/views.router.js";
import authRouter from "./Routes/auth.router.js";
import productsRouter from "./Routes/products.router.js";
import cartsRouter from "./Routes/cart.router.js";
import usersRouter from "./Routes/users.router.js";
import startPassport from "./Config/passport.config.js";
import { enviromentOptions } from "./Config/enviroment.options.js";
//import connDatabase from "./Config/dBConnections.js";

import loggerRouter from "./Routes/log.router.js";
import { addLogger } from "./Repository/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js"; 
import { swaggerSpecs } from "./Config/swagger.config.js";
import swaggerUI from "swagger-ui-express"

const app = express();

const httpServer = app.listen(enviromentOptions.server.port, ()=>{ //httpServer;
    console.log(`Server listening in port ${enviromentOptions.server.port}`);
});

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders:[
       "Content-Type",
       "Authorization",
       "Access-Control-Allow-Credentials"
    ]
}
 
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(express.static(__dirname + '/../public' ));
app.use(cors(corsOptions));
app.use(cookieParser());

app.engine('.hbs', handlebars.engine({extname: '.hbs'})); // handlebars
app.set('views', path.join(__dirname, '/Views'));
app.set("view engine",".hbs");


app.use((req,res,next)=>{ // middleware socket
    req.io = io;
    next(); 
});

app.use(addLogger); //middleware de logger

startPassport(); // middleware de passport
app.use(passport.initialize()); 

// routers
app.use("/", viewsRouter);
app.use("/api/sessions",authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", loggerRouter);
app.use("/api/users", usersRouter);
app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

//app.use(errorHandler); //middleware de error

const io = new Server(httpServer);
//const connectDB = connDatabase();