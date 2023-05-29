import { cartServices, productServices, ticketServices } from "../Repository/index.Repository.js";

class cartController{
    static newCartController = async(req,res)=>{
        try{
            const newCart =  await cartServices.newCartService(req.body); //recibo el usuario actualizado con el id del carrito, retorna el token para actualizar
            if( newCart.status != "Error" ){
                res.cookie("cookie-token", newCart.data.updateUser.newUserToken, {maxAge: 60*60*1000, httpOnly: true}); //aca debo actualizar el token
            }else{
                res.status(409).json(update.message);
            }
            
            res.json(newCart.data.newCarry);
        }catch(err){
            res.status(404).send("no se pudo generar el carrito");
        }
    };

    static getProdCart = async(req,res)=>{
        try{
            const { cid } = req.params;
            const cartProducts = await cartServices.getProdCartService(cid);
            req.io.emit("sendDataCart", cartProducts);
            res.send(cartProducts);
        }catch(err){
            res.status(404).send("error")
        }
    };

    static addProdCartController = async(req,res)=>{
        try{
            const data = req.params;
            const productAdded = await cartServices.addProdCartService(data);

            req.io.emit("sendDataCart", productAdded.payload);
            res.json(productAdded);
        }catch(err){
            res.status(404).send("no se pudo actualizar el producto");
        }
    };

    static delProdCartController = async(req,res)=>{
        try{
            const { cid, pid } = req.params;
            const productDeleted = await cartServices.delProdCartService(cid,pid);

            req.io.emit("sendDataCart", productDeleted);
            res.json(productDeleted);
        }catch(err){
            res.status(404).send("no se pudo actualizar el producto");
        }
    };

    static delAllProdCartController = async(req,res)=>{
        try{
            const { cid } = req.params;
            const allProductsDeleted = await cartServices.delAllProdCartService(cid);
            req.io.emit("sendDataCart", allProductsDeleted);
            res.send(allProductsDeleted);
        }catch(err){
            res.status(404).send("no se pudo actualizar el producto");
        }
    }

    static purchaseCartController = async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const cart = await cartServices.getProdCartService(cartId); // lo que hay en el carrito
            const carts = cart.products;
            const final = await cartServices.updateCartService(carts, cartId)
            req.io.emit("sendDataPurchase", final.payload);
            
            res.json(final.payload)     
        } catch (error) {
            res.status(404).send("no se pudo actualizar el producto");
        }         
    }
}

export { cartController }