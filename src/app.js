import express from "express";
import mongoose from "mongoose";

import { Server } from "socket.io";
import __dirname from "./utils.js";
import { json , urlencoded } from "express";

import viewsRouter from "./Routes/views.router.js";
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

app.use((req,res,next)=>{ 
    req.io = io;
    next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

mongoose
.connect(
    "mongodb+srv://frenzy9304:bsKb83RDJ8GHztsI@clusterecommerce.erfilm8.mongodb.net/?retryWrites=true&w=majority"
)
.then((conn)=>{
    console.log("Connected to DB!");
});