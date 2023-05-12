import cartManagerDb from "../Dao/Mongo/cartManagerDb.js";
const groupCarts = new cartManagerDb();

export const newCartController = async(req,res)=>{
    try{
        const newCart =  await groupCarts.createNewCart();
        res.send(newCart);
    }catch(err){
        res.status(404).send(err, "no se pudo generar el carrito");
    }
};

export const getProdCart = async(req,res)=>{
    try{
        const { cid } = req.params;
        const cartProducts = await groupCarts.getProductsInCart(cid);
        
        res.send(cartProducts);
    }catch(err){
        res.status(404).send(err,"error")
    }
};

export const addProdCartController = async(req,res)=>{
    try{
        const { cid, pid } = req.params;
        const productAdded = await groupCarts.handleCartProduct(cid,pid);
        
        res.send(productAdded);
    }catch(err){
        res.status(404).send(err,"no se pudo actualizar el producto");
    }
};

export const delProdCartController = async(req,res)=>{
    try{
        const { cid, pid } = req.params;
        const productDeleted= await groupCarts.deleteProduct(cid,pid);

        res.send(productDeleted);
    }catch(err){
        res.status(404).send(err,"no se pudo actualizar el producto");
    }
};

export const delAllProdCartController = async(req,res)=>{
    try{
        const { cid } = req.params;
        const allProductsDeleted = await groupCarts.deleteAllProducts(cid);

        res.send(allProductsDeleted);
    }catch(err){
        res.status(404).send(err,"no se pudo actualizar el producto");
    }
}