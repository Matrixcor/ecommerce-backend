import fs from "fs";

class productManager{
    #path = "" ;
    constructor(path){
        this.#path = path;
    }
    async addProduct(newData){
        const products = await this.getProduct();
        const count = await this.loadCount();

        const { title, description, price, code, status, category, stock, thumbnail } = newData;

        if(!title || !description || !price || !code || !status || !category || !stock || !thumbnail){
            return {mesagge:"complete todo los campos"};
        }
        
        const  productWithSameCode = products.some(
            (prod) => prod.code === code
        );
        if(productWithSameCode){
            return {mesagge:"El Codigo ingresado ya existe, por favor elija otro."};
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
            thumbnail: thumbnail
        };
        const productsToAdd = [...products, newProduct];
        await fs.promises.writeFile(this.#path, JSON.stringify(productsToAdd));
        return {data: productsToAdd, mesagge:"producto agregado correctamente"};
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
    async productExistence(pid){ //verifica si el producto existe
        const product = await this.getProduct();
        const  productExist = product.some(
            (prod) => prod.id === pid
        );
        if(!productExist){
            throw new Error ("El producto seleccionado no existe");
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

    async updateProduct(pid, newdata){
        const product = await this.getProduct();
        this.productExistence(pid);
        const newArrayProducts = await product.map( prod =>{
            if(prod.id === pid){
                return {...prod, id: prod.id, ...newdata}
            }
            return prod;
        })
        await fs.promises.writeFile(this.#path, JSON.stringify(newArrayProducts))
        return {newArrayProducts, message: "El producto fue actualizado correctamente"};
    }

    async deleteProduct(pid){
        const product = await this.getProduct();
        await this.productExistence(pid);
        const newArrayProduct = product.filter(prod => prod.id != pid);
        await fs.promises.writeFile(this.#path, JSON.stringify(newArrayProduct))
        return {data: newArrayProduct, mesagge:"producto eliminado correctamente"};
    }
}

export default productManager