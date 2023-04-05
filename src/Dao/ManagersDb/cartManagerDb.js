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

    async updateCartProduct(cid,pid, cartProduc){ //no lo termine, no puedo convertir el id de producto a un string.
        try{
            const array = cartProduc.products;   
            
            /*       
            for(let i = 0; i < array.products.length; i++) {
                const ref = array.products[i];
                console.log(ref)

                if(ref.produc._id.toString() === pid) {
                    console.log("ingresa funcion")

                    array.products[i].quantity = array.products[i].quantity + 1;
                    await array.save();
                }
            };
            */
            const prodIndex = array.product.findIndex((prod)=>{
                prod.product._id.toString() == pid;
            })
            console.log(prodIndex);

            array.products[prodIndex].quantity = array.products[i].quantity + 1;
            
            await array.save();

            return { status: "succes", payload: array, message: "La cantidad de producto se actualizo correctamente" };
        }catch(err){
            return { message: "Error al actualizar la cantidad de producto" };
        }
    }

    async deleteProduct(cid, pid){ // no pude concluirlo
        try{ // revisar que elimine un solo producto
            const cartmodify = await this.getProductsInCart(cid)

            for (const i=0 ; i < cartmodify.products.length ; i++){
                if(cartmodify.products[i].idProduct == pid) {
                    cartmodify.products[i].quantity > 1 ? modQuantity() : quitItem()
                };
            };

            // en caso de eliminar el producto, es decir cantidad igual a uno
            const modQuantity = ()=>{
                
            }
            const quitItem = ()=>{
                const newArrayMod = cartmodify.products.filter((prod)=>{
                    prod.products != pid;
                });
            }

            //console.log(newArrayMod);
            //return { data: newArrayProduct, mesagge:"producto eliminado correctamente" };
        }catch (error) {
            return { mesagge: "Error deleting product" };
        }
    }

    async deleteAllProducts(cid){
        try{
            const deleteAll= await this.getProductsInCart(cid);
            const cart = deleteAll;
            cart.products = [];
            await cart.save();
            return { data: cart, message: "El producto se agrego correctamente" };
            
        }catch (error) {
            return { mesagge: "Error deleting product" };
        }
    }
}

export default cartManagerDb;