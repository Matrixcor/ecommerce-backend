import fs from "fs";

class productManager{
    #path = "" ;
    constructor(path){
        this.#path = path;
    }
    async addProduct(newUser){
        const products = await this.getProduct();
        const count = await this.loadCount();
        const { title, description, price, code, status, category, stock, thumbnail } = newUser
        if(!title || !description || !price || !code || !status || !category || !stock || !thumbnail){
            return "complete todo los campos";
        }
        
        const  productWithSameCode = products.some(
            (prod) => prod.code === code
        );
        if(productWithSameCode){
            //throw new Error ("El Codigo ingresado ya existe, por favor elija otro.");
            return "El Codigo ingresado ya existe, por favor elija otro.";
        }
        
        const newProduct = {
            id: count, 
            title,
            description,
            price,
            code,
            status,
            category,
            stock,
            thumbnail: []
        };
        const productsToAdd = [...products, newProduct];
        await fs.promises.writeFile(this.#path, JSON.stringify(productsToAdd));
        return "succes";
    }
    async loadCount(){
        const arrayProduct = await this.getProduct();
        const long = arrayProduct.length;
        if(long == 0){
            return 0;
        }else{
            return arrayProduct[long - 1].id + 1;
        }
    }
    async productExistence(id){ //verifica si el producto existe
        const product = await this.getProduct();
        const  productExist = product.some(
            (prod) => prod.id === id
        );
        if(!productExist){
            throw new Error ("El producto seleccionado no existe, por favor elija otro.");
        }
    }
    async getProduct(){
        try{
            const product = await fs.promises.readFile(this.#path, "utf-8");
            return JSON.parse(product);
        }catch(e){
            return [];
        }
    }

    async getProductById(pid){
        const product = await this.getProduct();
        const productById = product.find(
            (prod)=> prod.id === pid
        );
        if(!productById){
            return "El producto buscado no existe";
        }else{
            return productById;
        }
    }

    async updateProduct(id, newdata){
        const product = await this.getProduct();
        this.productExistence(id);
        const newArrayProducts = product.map( prod =>{
            if(prod.id == id){
                return {...prod, id, ...newdata}
            }
            return prod;
        })
        await fs.promises.writeFile(this.#path, JSON.stringify(newArrayProducts))
    }

    async deleteProduct(id){
        const product = await this.getProduct();
        this.productExistence(id);
        const newArrayProduct = product.filter(prod => prod.id != id);
        await fs.promises.writeFile(this.#path, JSON.stringify(newArrayProduct))
    }
}

export default productManager