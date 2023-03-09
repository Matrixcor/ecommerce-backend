import { Router } from "express";
import productManager from "../Managers/productManager.js";

const groupProducts = new productManager("./././products.json");

const viewsRouter = Router();

viewsRouter.get("/", async (req,res)=>{
    
    const arrayProd = await groupProducts.getProduct(); //es solicitado mediante getproducts
    res.render("home", {arrayProd});
});

viewsRouter.get("/real-time-products", (req,res)=>{
    const realTimeArray = [];
    res.render('real_time_products', realTimeArray);
});

export default viewsRouter;