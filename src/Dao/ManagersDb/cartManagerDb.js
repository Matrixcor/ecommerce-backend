import cartsModel from "../Models/cartsModel.js";
import productModel from "../Models/productModel.js";

class cartManagerDb{
        
    async createNewCart(){
        try {
            const newCart = { products: [] };
            const cartArray = await cartsModel.create(newCart);
            return { status: "succes", payload: newCart, message: "success, New Cart Created" };
        }catch(error){
            return { status: "error", message: "Error - cart not created" };
        }
    }

    async getCarts(){
        try{ //trae datos de la db
            const carts = await cartsModel.find().lean();
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

    async handleCartProduct(cid,pid){
        const cartProduc = await this.getProductsInCart(cid); // si no existe el carrito

        if(typeof(cartProduc.products) == "string"){
            return { status:"error", message:"no se puede agregar el producto porque el carrito seleccionado no existe"};
        } 
        const arrayToCompare = cartProduc.products;
        const comparedprod = arrayToCompare.some((prod) => prod.product._id.toString() === pid );

        if(comparedprod){
            return await this.updateCartProduct(cid,pid,cartProduc);
        }else{
            return await this.addProduct(cid,pid,cartProduc);
        } 
    }

    async addProduct(cid, pid, cartProduc){ 
        try {
            const cart = cartProduc;
            cart.products.push({ 
                product: pid, 
                quantity: 1 
            });
            await cart.save();
            return { status: "succes", payload: cart, message: "El producto se agrego correctamente" };
        } catch (error) {
            return { status: "error", message: "error el producto no se pudo agregar" };
        }
    }

    async updateCartProduct(cid,pid, cartProduc){
        try{
            const array = cartProduc;
            for(let i = 0; i < array.products.length; i++) {
                if(array.products[i].product._id.toString() === pid) {
                    array.products[i].quantity ++;
                    console.log(array.products[i].quantity)
                }
            };
            await array.save();
            return { status: "succes", payload: array, message: "La cantidad de producto se actualizo correctamente" };
        }catch(err){
            return { message: "Error al actualizar la cantidad de producto" };
        }
    }

    async deleteProduct(cid, pid){
        try{
            const cartmodify = await this.getProductsInCart(cid)
            
            for (let i=0 ; i < cartmodify.products.length ; i++){

                if(cartmodify.products[i].product._id.toString() === pid) {
                    cartmodify.products[i].quantity > 1 ? modQuantity(i) : quitItem(cid, pid)
                };
            };
            async function modQuantity(i){
                cartmodify.products[i].quantity --;
                await cartmodify.save();
                return { status: "succes", payload: cartmodify, mesagge:"producto eliminado correctamente" };
            }
            async function quitItem(cid, pid){                
               let deleted = await cartsModel.updateOne(
                {_id: cid},
                { $pull: { products: {product: pid } }}
               )
               return { status: "succes", payload: cartmodify, mesagge:"El producto se quito del carrito correctamente" };
            }            
        }catch (error) {
            return { status: "Error", mesagge: "Error deleting product" };
        }
    }

    async deleteAllProducts(cid){
        try{
            const deleteAll= await this.getProductsInCart(cid);
            const cart = deleteAll;
            cart.products = [];
            await cart.save();
            return { status:"succes", payload: cart, message: "El carrito se vacio correctamente" };
            
        }catch (error) {
            return { mesagge: "Error deleting product" };
        }
    }
}

export default cartManagerDb;