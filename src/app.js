import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js";
import { json , urlencoded } from "express";
import { Server } from "socket.io";

import viewsRouter from "./Routes/views.router.js";
import authRouter from "./Routes/auth.router.js";
import productsRouter from "./Routes/products.router.js";
import cartsRouter from "./Routes/carts.router.js";
import chatManagerDb from "./Dao/ManagersDb/chatManagerDb.js";

import { engine } from "express-handlebars";

const app = express();
const groupMessages = new chatManagerDb();
app.use(urlencoded({extended: true}));
app.use(json());

app.engine('handlebars', engine());
app.set('views', __dirname + '/Views');
app.set('view engine','handlebars');
app.use(express.static(__dirname + '/../public' ));

const httpServer = app.listen("8080", ()=>{
    console.log("Server listening in port 8080");
});
const io = new Server(httpServer);
//chat
io.on("connection", (socket) => {
    console.log("New client connected.");

    socket.on("new-message", async (data) => {
      const allMessages = await groupMessages.newMessage(data);
      io.emit("messages", allMessages);
    });
    socket.on("new-user", async (username)=>{
        const recovermesage = await groupMessages.getMessages();
        socket.emit("messages",recovermesage);
        socket.broadcast.emit("new-user",username);
    })
    
});
// middleware socket
app.use((req,res,next)=>{ 
    req.io = io;
    next();
});
//middleware session
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://frenzy9304:bsKb83RDJ8GHztsI@clusterecommerce.erfilm8.mongodb.net/?retryWrites=true&w=majority" ,
            ttl:10000
        }),
        secret: "key-secret",
        saveUninitialized: true,
        resave: true,
    })
);
//middleware de autenticacion
function auth( req,res, next){
    if(req.session?.user === "user" && req.session?.isAdmin){
        return next();
    };
    return res.status(401).send("Error de autenticacion")
}

// router views
app.use("/", viewsRouter);
app.use("/api/sessions",authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


mongoose
.connect(
    "mongodb+srv://frenzy9304:bsKb83RDJ8GHztsI@clusterecommerce.erfilm8.mongodb.net/?retryWrites=true&w=majority"
)
.then((conn)=>{
    console.log("Connected to DB!");
});