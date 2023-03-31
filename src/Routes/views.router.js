import { Router } from "express";
import productManagerDb from "../Dao/ManagersDb/productManagerDb.js";
import chatManagerDb from "../Dao/ManagersDb/chatManagerDb.js";

const groupProducts = new productManagerDb();

const viewsRouter = Router();

viewsRouter.get("/", async (req,res)=>{
    const arrayProd = await groupProducts.getProduct();
    res.render("home", {arrayProd});
});

viewsRouter.get("/real-time-products", (req,res)=>{
    const realTimeArray = [];
    res.render('real_time_products', realTimeArray);
});

viewsRouter.get("/chat", async(req,res)=>{
    try{
        res.render("chat");
    }catch(error){
        res.render("error");
    }
});

export default viewsRouter;