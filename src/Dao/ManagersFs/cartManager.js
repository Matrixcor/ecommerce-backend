import fs from "fs"
import productManager from "../Managers/productManager.js";

const product = new productManager("./././products.json");

class cartManager{
    #path = "" ;
    constructor(path){
        this.#path = path;
    }
    
    async createNewCart(){
        const carts = await this.getCarts();
        const count = await this.loadCartCount();
        const newCart = {
            id: count,
            products: []
        }
        const cartToAdd = [...carts, newCart];
        await fs.promises.writeFile(this.#path, JSON.stringify(cartToAdd));
        return "success, New Cart Created";
    }

    async getCarts(){
        try{
            const carts = await fs.promises.readFile(this.#path, "utf-8");
            return JSON.parse(carts);
        }catch(e){
            return [];
        }
    }

    async loadCartCount(){
        const arrayCarts = await this.getCarts();
        const long = arrayCarts.length;
        if(long == 0){
            return 0;
        }else{
            return arrayCarts[long - 1].id + 1;
        }
    }
    
    async getProductsInCart(cid){
        const carts = await this.getCarts();
        const cartById = carts.find(
            (cart)=> cart.id === cid
        );
        if(!cartById){
            return "El carrito buscado no existe"; //error de si no lo encuentra
        }
        return (cartById.products);
    }

    async handleCartProduct(cid,pid){
        const carts = await this.getCarts();
        let cartProduc = await this.getProductsInCart(cid); // si no existe el carrito
        const existProductToAdd = await product.getProductById(pid); // importo de productManager para saber si existe el producto en la base de datos
        
        if(typeof(existProductToAdd) == "string"){ //esta parte se puede mejorar
            return " no se puede agregar el producto porque el producto seleccionado no existe";
        }
        if(typeof(cartProduc) == "string"){
            return " no se puede agregar el producto porque el carrito seleccionado no existe";
        }
        
        let comparedprod = await cartProduc.some( (prod) => prod.id == pid );
        if(comparedprod){
            await this.updateCartProduct(cid,pid, cartProduc, carts);
            return("La cantidad del producto fue actualizada");
        }else{
            await this.addProduct(cid,pid,carts);
            return("El producto se agrego correctamente");
        }
    }

    async addProduct(cid, pid, carts){ 
        const newproductToAdd = {
            id: pid,
            quantity: 1
        }
        await carts[cid].products.push(newproductToAdd);
        await fs.promises.writeFile(this.#path, JSON.stringify(carts));
    }

    async updateCartProduct(cid, pid, cartProduc, carts){
        const arrayProductUpdate = cartProduc.map( (prod)=>{ //por el momento solo agrega el producto de a una unidad, proximo en el req.body
            if(prod.id === pid){
                prod.quantity++;
                return prod;
            }else{
                return prod;
            }
        });
        carts[cid].products = arrayProductUpdate;
        await fs.promises.writeFile(this.#path, JSON.stringify(carts));
    }
}

export default cartManager