import { Router, json } from "express";

import cartManagerDb from "../Dao/ManagersDb/cartManagerDb.js";

const groupCarts = new cartManagerDb();

const cartsRouter = Router();
cartsRouter.use(json()); 

cartsRouter.post("/", async(req,res)=>{
    try{
        const newCart =  await groupCarts.createNewCart();
        res.send(newCart.message);
    }catch(err){
        res.status(404).send(err, "no se pudo generar el carrito");
    }
})
/*
- PUT api/carts/:cid deberá actualizar 
el carrito con un arreglo de 
productos con el formato 
especificado arriba.
- PUT api/carts/:cid/products/:pid 
deberá poder actualizar SÓLO la 
cantidad de ejemplares del producto 
por cualquier cantidad pasada desde 
req.body
*/
cartsRouter.get("/:cid", async (req,res)=>{
    try{
        const { cid } = req.params;
        const cartProducts = await groupCarts.getProductsInCart(cid);
        res.send(cartProducts);
    }catch(err){
        res.status(404).send(err,"error")
    }
})

cartsRouter.post("/:cid/product/:pid", async(req,res)=>{
    try{
        const { cid, pid } = req.params;
        const productAdded = await groupCarts.handleCartProduct(cid,pid);
        
        res.send(productAdded.message);
    }catch(err){
        res.status(404).send(err,"no se pudo actualizar el producto");
    }
})

cartsRouter.delete("/:cid/products/:pid", async(req,res)=>{
    try{
        const { cid, pid } = req.params;
        const productAdded = await groupCarts.deleteProduct(cid,pid);

        res.send(productAdded.message);
    }catch(err){
        res.status(404).send(err,"no se pudo actualizar el producto");
    }
})

cartsRouter.delete("/:cid", async(req,res)=>{
    try{
        const { cid } = req.params;
        const productAdded = await groupCarts.deleteAllProducts(cid);
        res.send(productAdded.message);
    }catch(err){
        res.status(404).send(err,"no se pudo actualizar el producto");
    }
})

export default cartsRouter;