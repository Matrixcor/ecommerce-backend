import express from "express";
import { json , urlencoded } from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import passport from "passport";
import cookieParser from "cookie-parser";

import {__dirname} from "./utils.js";
import viewsRouter from "./Routes/views.router.js";
import authRouter from "./Routes/auth.router.js";
import productsRouter from "./Routes/products.router.js";
import cartsRouter from "./Routes/cart.router.js";
import startPassport from "./Config/passport.config.js";
import { enviromentOptions } from "./Config/enviroment.options.js";
import  {chatController}  from "./Controllers/chat.controller.js";

const app = express();

app.use(urlencoded({extended: true}));
app.use(json());
app.use(cookieParser());

app.engine('handlebars', engine());
app.set('views', __dirname + '/Views');
app.set('view engine','handlebars');
app.use(express.static(__dirname + '/../public' ));

//httpServer;
const httpServer = app.listen(enviromentOptions.server.port, ()=>{
    console.log(`Server listening in port ${enviromentOptions.server.port}`);
});

const io = new Server(httpServer);

//chat
import {chatManagerDb} from "./Dao/Mongo/chatManagerDb.js";

const groupMessages = new chatManagerDb();


io.on("connection", (socket) => {
    console.log("New client Connected")
    socket.on("new-message", async (data) => {
        const allMessages = await groupMessages.newMessage(data);
        io.emit("messages", allMessages);
    });
  
    socket.on("new-user", async (username)=>{
        const recovermesage = await groupMessages.getMessages();
        socket.emit("messages",recovermesage);
        socket.broadcast.emit("new-user",username);
    });
});

// middleware socket
app.use((req,res,next)=>{ 
    req.io = io;
    next();
});

// middleware de passport
startPassport();
app.use(passport.initialize());

// routers
app.use("/", viewsRouter);
app.use("/api/sessions",authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);