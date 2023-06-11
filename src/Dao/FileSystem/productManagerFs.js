import fs from "fs";
import { v4 as uuidv4 } from "uuid"

class productManagerFs{
    #path = "" ;
    constructor(path){
        this.#path = path;
    }
    /*
    this.prods= {
        id: count,
        title,
        description,
        price,
        code,
        status,
        category,
        stock,
        thumbnail: thumbnail
    }
    
    prods.id = uuidv4();
    */
    
    async addProduct(title, description, price, code, status, category, stock, thumbnail){
        try {
            const products = await this.getAllProduct();
            //solucionar el tema del id para que funcione igual que la database
            const count = await this.loadCount();
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
            return productsToAdd;
        } catch (error) {
            return {status: "Error", message: "El producto no se agrego correctamente"};
        }
    }
    async getForSomeProduct(){
        const product = await this.getAllProduct();
        return product;
    };
    async loadCount(){
        const arrayProduct = await this.getAllProduct();
        const long = arrayProduct.length;
        if(long == 0){
            return 0;
        }else{
            return arrayProduct[long - 1].id + 1;
        }
    }
    async productExistence(pid){ //verifica si el producto existe
        const product = await this.getAllProduct();
        const  productExist = product.some(
            (prod) => prod.id === pid
        );
        if(!productExist){
            throw new Error ("El producto seleccionado no existe");
        }
    }

    //para traer todos los productos con o sin filtro

    async getAllProduct(){
        try{
            const product = await fs.promises.readFile(this.#path, "utf-8");
            const prod = JSON.parse(product);
            return { status: "succes", payload: prod, from: "file"}
        }catch(e){
            return [];
        }
    }
    
    async getFilterProduc(searchKey,filterOptions){ // toda esta logica deberia pasarla al service
        try {
            let newArray;
            let num;
            const element = {}; 
            const {limit, sort} = filterOptions;
            const product = await fs.promises.readFile(this.#path, "utf-8")
            // debo buscar todos los productos que coincidan con la search key
            
            if(searchKey.price) element = { prop: prod.price , key: searchKey.price};
            if(searchKey.title) element = { prop: prod.title , key: searchKey.price};
            if(searchKey.code) element = { prop: prod.code , key: searchKey.price};
            const { prop, key } = element;
            const array = product.map( (prod)=>{
                prop === key;
            })
            //limito el numero de productos a mostrar
            let long = product.length();
            limit <= long ? num = limit : num = long
            for( let i=0; i<= num ; i++){
                newArray.push(array[i]);
            }
            
            return {FileSystem: true, arrayProd};
        } catch (error) {
            
        }
    }

    async getProductById(pid){
        const product = await this.getAllProduct();
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
        const product = await this.getAllProduct();
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
        const product = await this.getAllProduct();
        await this.productExistence(pid);
        const newArrayProduct = product.filter(prod => prod.id != pid);
        await fs.promises.writeFile(this.#path, JSON.stringify(newArrayProduct))
        return {data: newArrayProduct, mesagge:"producto eliminado correctamente"};
    }
    
}

export { productManagerFs }