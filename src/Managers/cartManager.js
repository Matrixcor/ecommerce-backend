import fs from "fs"

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
        return "success";
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
            return "El carrito buscado no existe";
        }
        return (cartById.products);
    }

    async handleCartProduct(cid,pid){
        const carts = await this.getCarts();

        let cartProduc = await this.getProductsInCart(cid); // si no existe el carrito
        if(Array.isArray(cartProduc)){
            return " no se puede agregar el producto";
        }
        let comparedprod = await cartProduc.some( (prod) => prod.id == pid );
        if(comparedprod){
            await this.updateCartProduct(cid,pid, cartProduc, carts);
        }else{
            await this.addProduct(cid,pid, cartProduc, carts);
        }
    }

    async addProduct(cid, pid, cartProduc, carts){ 
        const newproductToAdd = {
            id: pid,
            quantity
        }
        const newArrayProduct = [...cartProduc, newproductToAdd];
        carts[cid].products = newArrayProduct;
        await fs.promises.writeFile(this.#path, JSON.stringify(carts));
        return("succes");
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
        return("succes");
    }
}

export default cartManager