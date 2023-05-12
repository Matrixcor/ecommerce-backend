import express from "express";
import { json , urlencoded } from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import passport from "passport";
import cookieParser from "cookie-parser";

import __dirname from "./utils.js";
import viewsRouter from "./Routes/views.router.js";
import authRouter from "./Routes/auth.router.js";
import productsRouter from "./Routes/products.router.js";
import cartsRouter from "./Routes/carts.router.js";
import startPassport from "./Config/passport.config.js";
import { enviromentOptions } from "./Config/enviroment.options.js";
import { chatController } from "./Controllers/chat.controller.js";

const app = express();

app.use(urlencoded({extended: true}));
app.use(json());
app.use(cookieParser());

app.engine('handlebars', engine());
console.log(__dirname)
app.set('views', __dirname + '/Views');
app.set('view engine','handlebars');
app.use(express.static(__dirname + '/../public' ));

const httpServer = app.listen(enviromentOptions.server.port, ()=>{
    console.log(`Server listening in port ${enviromentOptions.server.port}`);
});
const io = new Server(httpServer);

//chat
io.on("connection", chatController);

// middleware socket
app.use((req,res,next)=>{ 
    req.io = io;
    next();
});

//middleware de passport
startPassport();
app.use(passport.initialize());

// router views
app.use("/", viewsRouter);
app.use("/api/sessions",authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//mongo conection
const { connectDB } = await import ("./Config/dBConnections.js");
connectDB;