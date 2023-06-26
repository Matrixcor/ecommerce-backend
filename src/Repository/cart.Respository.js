import { authServices, productServices } from "./index.Repository.js";
import { currentLogger } from "./logger.js";

const logger = currentLogger();

class cartRepository{
    constructor(dao){
        this.dao = dao;
    };

    async newCartService(email){
        try{
            const newCarry =  await this.dao.createNewCart();
            if(newCarry.status == "Error"){
                logger.error("Error en newCartService - no se pudo insertar el carrito en la DB")
                return {status: "Error", message:"El carrito no se pudo generar"}
            }
            const inf = {cart: newCarry.cartArray._id} // debo traer el id del carrito y guardarlo en el user
            const updateUser = await authServices.updateProfileUser(email, inf);     //retorna el user actualizado
            const data = { newCarry, updateUser}
            return {status: "succes", data};
        }catch(err){
            return { status: "Error", message: "Error - cart not created" };
        }
    };

    async getProdCartService(cid){
        try{
            const cartProducts = await this.dao.getProductsInCart(cid);
            return cartProducts
        }catch(err){
            return {status:"Error", message:"No se pudo obtener el producto"};
        }
    };

    async addProdCartService(data, user){
        try{
            const { cid, pid } = data;
            const cartProduc = await this.dao.getProductsInCart(cid); // si no existe el carrito
            if(typeof(cartProduc.products) == "string"){
                return { status:"Error", message:"no se puede agregar el producto porque el carrito seleccionado no existe"};
            }

            const prodOwner = await this.dao.getProdByIdForCart(pid); // aca evito que el role premium agregue sus propios productos al carrito
            if (prodOwner.owner == user.email && user.role == "premium"){
                return { status:"Error", message:"Error, eres usuario premium, no puedes agregar tus propios productos al carrito"};
            }

            const arrayToCompare = cartProduc.products;
            const comparedprod = arrayToCompare.some((prod) => prod.product._id.toString() === pid);

            if(comparedprod){ //si no existe el prod en el carrito lo agrego
                return await this.dao.incrementCartProdQuantity(cid,pid,cartProduc);
            }else{
                return await this.dao.addProduct(cid,pid,cartProduc);
            }
        }catch(err){
            return { status: "Error", message: "error, no se pudo procesar el producto" }
        }
    };

    async delProdCartService(cid,pid){
        try{
            const cartmodify = await this.dao.getProductsInCart(cid);
            let res;
            for (let i=0 ; i < cartmodify.products.length ; i++){
                if(cartmodify.products[i].product._id.toString() === pid) {
                    cartmodify.products[i].quantity > 1 ? res = await this.dao.decrementCartProdQuantity(i, cartmodify) : res = await this.dao.quitCartProduct(cid, pid)
                };
            };
            const response = await this.dao.getProductsInCart(cid);
            return response
        }catch(err){
            return {status:" Error", message:"no se pudo actualizar el producto"}
        }
    };

    async delAllProdCartService(cid){
        try{
            const deleteAll= await this.dao.getProductsInCart(cid);
            const cart = deleteAll;
            const allProductsDeleted = await this.dao.deleteAllProducts(cart);
            return allProductsDeleted;
        }catch(err){
            return {status:" Error", message:"no se pudo actualizar el producto"}
        }
    }

    async updateCartService(carts, cid){
        try {
            const prodFiltered = [];
            const cartChecked = [];
            const rejectedProds = [];
            let stokcToUpdate;
            await carts.forEach((p) => {
                const arrayProd = { //aca puedo aplicar un DTO
                    prodId: p.product._id,
                    prodTitle: p.product.title,
                    prodPrice: p.product.price,
                    prodImage: p.product.thumbnail,
                    prodQty: p.quantity,
                    amount:""
                };
                prodFiltered.push(arrayProd);
            });
           
            for(let i = 0; i < prodFiltered.length; i++){
                const cartProdId = prodFiltered[i].prodId; //puedo desestructurar el prodfiltered 
                const cartProdTitle = prodFiltered[i].prodTitle;
                const cartProdPrice = prodFiltered[i].prodPrice;
                const cartProdImage = prodFiltered[i].prodImage;
                const cartProdQty = prodFiltered[i].prodQty;
                const cartProdAmount = (cartProdPrice * cartProdQty);
                const prodDb = await productServices.getByIdProdService(cartProdId); // busco en la DB el producto 
                const prodToWork = prodDb.payload; // producto desde la db
                stokcToUpdate = (prodToWork.stock - cartProdQty) ;
               
                if(cartProdQty < prodToWork.stock){ // comparo la cantidad de Stock que hay en la Db con el quantity del producto que voy a comprar
                    const checkedProds = {
                        prodId: cartProdId,
                        prodTitle: cartProdTitle,
                        prodPrice: cartProdPrice,
                        prodImage: cartProdImage,
                        prodQuantity: cartProdQty,
                        amount: cartProdAmount
                    }
                    cartChecked.push(checkedProds);
                }else{
                    const reject = {
                        prodId: cartProdId,
                        prodTitle: cartProdTitle,
                        prodPrice: cartProdPrice,
                        prodImage: cartProdImage,
                        prodQuantity: cartProdQty,
                        amount: cartProdAmount
                    };
                    rejectedProds.push(reject);
                }
            };
            return { cartChecked, stokcToUpdate };
        }catch(err){
            return {status: "Error", message:"This product do not be updated"};
        }
    };

    async updateCartAndStockProduct(arrayVerified, cid, carts){ //se ejecuta cuando se emite el ticke y confirma la compra
        arrayVerified.cartChecked.forEach(async(e)=>{
            const delCartProd = await this.dao.quitCartProduct(cid, e.prodId);
            const newStock = arrayVerified.stokcToUpdate; //quito los produstos con stock del carrito
            carts.forEach(async(p)=>{
                if(p.product._id == e.prodId){
                    const newProd={
                        title: p.product.title, 
                        description: p.product.description, 
                        price: p.product.price, 
                        code: p.product.code, 
                        status: p.product.status, 
                        category: p.product.category, 
                        stock: newStock, 
                        thumbnail: p.product.thumbnail
                    }
                    const updtStockProdDb = await productServices.updateProdService(newProd)
                }
            })
        })
    }
}

export { cartRepository };