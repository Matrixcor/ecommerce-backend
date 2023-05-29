
import cartsModel from "../Mongo/Models/cartsModel.js";

class cartManagerDb{
        
    async createNewCart(){
        try {
            const newCart = { products: [] };
            const cartArray = await cartsModel.create(newCart);
            return { status: "succes", cartArray };
        }catch(error){
            return { status: "error", message: "Error - cart not created" };
        }
    }

    async getCarts(){
        try{ 
            const carts = await cartsModel.find().lean(); //trae datos de la db
            return { status: "succes", payload: carts, message: "El producto se agrego correctamente" };
        }catch(error){
            return { stat: 400, result: "Error trying to retrieve the carts" };
        }
    }
 
    async getProductsInCart(cid){
        const cartById = await cartsModel.findById(cid);
        if(!cartById){
            return "El carrito buscado no existe"; //error de si no lo encuentra
        }
        return (cartById);
    }

    async addProduct(cid, pid, cartProduc){ 
        try {
            const cart = cartProduc;
            cart.products.push({ 
                product: pid, 
                quantity: 1 
            });
            await cart.save();
            return { status: "succes", payload: cart, mesagge:"producto agregado correctamente" };
        } catch (error) {
            return { status: "error", message: "error el producto no se pudo agregar" };
        }
    }

    async incrementCartProdQuantity(cid,pid, cartProduc){
        try{
            const array = cartProduc;
            for(let i = 0; i < array.products.length; i++) {
                if(array.products[i].product._id.toString() === pid) {
                    array.products[i].quantity ++;
                    console.log(array.products[i].quantity)
                }
            };
            await array.save();
            return { status: "succes", payload: array, mesagge:"producto actualizado correctamente" };
        }catch(err){
            return { message: "Error al actualizar la cantidad de producto" };
        }
    }
        
    async decrementCartProdQuantity(i, cartmodify){ //elimino de a un producto 
        cartmodify.products[i].quantity --;
        await cartmodify.save();
        return { status: "succes", payload: cartmodify, mesagge:"producto eliminado correctamente" };
    }

    async quitCartProduct(cid, pid){  // cuando queda un solo producto lo quito directamente del carrito
        let deleted = await cartsModel.updateOne(
            {_id: cid},
            { $pull: { products: {product: pid } }}
        )
        return { status: "succes", payload: deleted, mesagge:"El producto se quito del carrito correctamente" };
    }            
    
    async deleteAllProducts(cart){
        try{
            cart.products = [];
            await cart.save();
            return { status:"succes", message: "El carrito se vacio correctamente" };
            
        }catch (error) {
            return { status: "Error" ,mesagge: "Error deleting product" };
        }
    }
}

export { cartManagerDb };