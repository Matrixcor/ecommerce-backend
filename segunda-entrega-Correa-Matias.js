const fs = require('fs');

class productManager{
    #path = "./data.json" ;

    async addProduct(title, description, price, thumbnail, code, stock){
        const products = await this.loadProduct();
        const count = await this.loadCount();
        const  productWithSameCode = products.some(
            (prod) => prod.code === code
        );
        if(productWithSameCode){
            throw new Error ("El Codigo ingresado ya existe, por favor elija otro.");
        }
        const newProduct = {
            id: count, 
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        const productsToAdd = [...products, newProduct]
        await fs.promises.writeFile(this.#path, JSON.stringify(productsToAdd))
    }
   
    async loadProduct(){ //trae los datos del archivo json
        try{
            const product = await fs.promises.readFile(this.#path, "utf-8");
            return JSON.parse(product);
        }catch(e){
            return [];
        }       
    }
    async loadCount(){ //carga el contador con el ultimo "id" del array producto
        const arrayProduct = await this.loadProduct();
        const long = arrayProduct.length;
        if(long == 0){
            return 0;
        }else{
            return arrayProduct[long - 1].id + 1;
        }
    }
    async productExistence(id){ //verifica si el producto existe
        const product = await this.loadProduct();
        const  productExist = product.some(
            (prod) => prod.id === id
        );
        if(!productExist){
            throw new Error ("El producto seleccionado no existe, por favor elija otro.");
        }
    }
    async getProduct(){
        try{
            const product = await this.loadProduct();
            product.forEach((prod)=>{
                console.log(prod)
            })
        }catch(e){
            console.log("No hay productos para mostrar")
        }
    }

    async getProductById(id){
        const product = await this.loadProduct();
        const productById = product.find(
            (prod)=> prod.id === id
        );
        if(!productById){
            console.log("El producto buscado no existe")
        }else{
            console.log("El producto buscado es: \n",productById)
        }
    }

    async updateProduct(id, newdata){
        const product = await this.loadProduct();
        this.productExistence(id);
        const newArrayProducts = product.map( prod =>{
            if(prod.id == id){
                return { ...prod, id, ...newdata}
            }
            return prod
        })
        await fs.promises.writeFile(this.#path, JSON.stringify(newArrayProducts))
    }

    async deleteProduct(id){
        const product = await this.loadProduct();
        this.productExistence(id);
        const newArrayProduct = product.filter(prod=> prod.id != id);
        await fs.promises.writeFile(this.#path, JSON.stringify(newArrayProduct))
    }
}

function main(){
    const groupProducts = new productManager() // con esto creo el objeto

    //groupProducts.addProduct("Producto de Prueba","Este es el producto de prueba", 200, "Sin imagen", "abc123", 25) //agrego el primer producto

    //groupProducts.getProductById() //me muestra error al no encontrar un producto con dicho ID

    //groupProducts.updateProduct(6, {price: 1000, stock: 10})

    //groupProducts.deleteProduct(5)
}
main();