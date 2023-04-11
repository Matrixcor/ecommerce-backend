import { Router } from "express";
import productManagerDb from "../Dao/ManagersDb/productManagerDb.js";
import cartManagerDb from "../Dao/ManagersDb/cartManagerDb.js";
import chatManagerDb from "../Dao/ManagersDb/chatManagerDb.js";

const groupProducts = new productManagerDb();
const groupCarts = new cartManagerDb();

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

viewsRouter.get("/carts/:cid", async(req,res)=>{
    try{
        const { cid } = req.params;
        const cartsArray = await groupCarts.getProductsInCart(cid);
        let arr;

        for(let i = 0 ; i < cartsArray.products.length ; i++){
            arr = { ...arr, ...cartsArray.products[i].product }
        }
        console.log(arr) 

        res.render("carts", {arr});
    }catch(error){
        res.render("error");
    }
});
viewsRouter.get("/products", async(req,res)=>{
    try{
        const listProd = [];
        res.render("products",listProd);
    }catch(error){
        res.render("error");
    }
});
export default viewsRouter;