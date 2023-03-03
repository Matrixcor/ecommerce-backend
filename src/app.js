import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./Routes/products.Router.js";
import cartsRouter from "./Routes/carts.router.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

app.use(express.static(__dirname + '/../public' ));

app.listen("8080", ()=>{
    console.log("Server listening in port 8080");
});