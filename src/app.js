import express from "express";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { json , urlencoded } from "express";

import viewsRouter from "./Routes/views.router.js";
import productsRouter from "./Routes/products.Router.js";
import cartsRouter from "./Routes/carts.router.js";

import { engine } from "express-handlebars";

const app = express();
app.use(urlencoded({extended: true}));
app.use(json());

app.engine('handlebars', engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname + '/../public' ));

const httpServer = app.listen("8080", ()=>{
    console.log("Server listening in port 8080");
});

const io = new Server(httpServer);

io.on("connection",(socket)=>{
    console.log("New Client Connected");
});

app.use((req,res,next)=>{ 
    req.io = io;
    next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
