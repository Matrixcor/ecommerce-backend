import cartsModel from "../Models/cartsModel.js";

class cartManagerDb{
        
    async createNewCart(){
        try {
            const newCart = { products: [] };
            const cartArray = await cartsModel.create(newCart);
            return { data: newCart, message: "success, New Cart Created" };
        }catch(error){
            return { message: "Error - cart not created" };
        }
    }

    async getCarts(){
        try{ //trae datos de la db
            const carts = await cartsModel.find().lean();
            return carts;
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
        if(typeof(cartProduc) == "string"){
            return { message:"no se puede agregar el producto porque el carrito seleccionado no existe"};
        } 
        const arrayToCompare = cartProduc.products;
        const comparedprod = arrayToCompare.some((prod) => prod.idProduct == pid );

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
                idProduct: pid, 
                quantity: 1 
            });
            await cart.save();
            return { data: cart, message: "El producto se agrego correctamente" };
        } catch (error) {
            return { message: "Error el producto no se pudo agregar" };
        }
    }

    async updateCartProduct(cid,pid, cartProduc){
        try{
            const array = cartProduc;            
            for(let i = 0; i < array.products.length; i++) {
                if(array.products[i].idProduct == pid) {
                    array.products[i].quantity = array.products[i].quantity + 1;
                    await array.save();
                }
            };
            return { data: array, message: "La cantidad de producto se actualizo correctamente" };
        }catch(err){
            return { message: "Error al actualizar la cantidad de producto" };
        }
    }
}

export default cartManagerDb;