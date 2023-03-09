import { Router, json } from "express";
import cartManager from "../Managers/cartManager.js";

const groupCarts = new cartManager("./././carts.json");

const cartsRouter = Router();

cartsRouter.use(json()); 

cartsRouter.post("/", async(req,res)=>{
    try{
        const newCart =  await groupCarts.createNewCart();
        res.send(newCart);
    }catch(err){
        res.status(404).send(err, "no se pudo generar el carrito");
    }
})

cartsRouter.get("/:cid", async (req,res)=>{
    try{
        const { cid } = req.params;
        const cartProducts = await groupCarts.getProductsInCart(parseInt(cid));
        res.send(cartProducts);
    }catch(err){
        res.status(404).send(err,"error")
    }
})

cartsRouter.post("/:cid/product/:pid", async(req,res)=>{
    try{
        const { cid, pid } = req.params;
        const productAdded = await groupCarts.handleCartProduct( parseInt(cid), parseInt(pid) );
        res.send(productAdded);
    }catch(err){
        res.status(404).send(err,"no se pudo actualizar el producto");
    }
})

export default cartsRouter;