import { Router } from "express";
import productManagerDb from "../Dao/ManagersDb/productManagerDb.js";
import cartManagerDb from "../Dao/ManagersDb/cartManagerDb.js";
import chatManagerDb from "../Dao/ManagersDb/chatManagerDb.js";

const groupProducts = new productManagerDb();
const groupCarts = new cartManagerDb();

const viewsRouter = Router();

viewsRouter.get("/", async (req,res)=>{
    const arrayProd = await groupProducts.getViewProducts();
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
        let prod = [];
        for(let i=0 ; i< cartsArray.products.length ; i++){
            const objt = { 
                id: cartsArray.products[i].product._id,
                quantity: cartsArray.products[i].quantity
            };
            prod.push({...objt})
        }
        res.render("carts",{prod});

    }catch(error){
        res.render("error");
    }
});

// vistas webs 

viewsRouter.get("/products", async(req,res)=>{
    try{
        const arrayViewProd = await groupProducts.getViewProducts();
        const dataLoginUser = req.session;
        const data = { arrayViewProd, dataLoginUser }
        res.render("products", {data});
    }catch(error){
        res.render("error");
    }
});

viewsRouter.get("/login", async(req,res)=>{
    try{
        res.render("login");
    }catch(error){
        res.render("error");
    }
});

viewsRouter.get("/register", async(req,res)=>{
    try{
        res.render("register");
    }catch(error){
        res.render("error");
    }
});

viewsRouter.get("/profile", async(req,res)=>{
    try{
        const dataUser = req.session;
        res.render("profile", {dataUser});
    }catch(error){
        res.render("error");
    }
});

export default viewsRouter;