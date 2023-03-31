import productModel from "../Models/productModel.js";

class productManagerDb {
    
    async addProduct(newData){
        
        try{
            const { title, description, price, code, status, category, stock, thumbnail } = newData;
            if(!title || !description || !price || !code || !status || !category || !stock || !thumbnail){
                return {mesagge:"complete todo los campos"};
            }
            
            const productsToAdd = await productModel.create({ title, description, price, code, status, category, stock, thumbnail });
            const productsAdd = await this.getProduct();
            return {data: productsAdd, mesagge:"producto agregado correctamente"};
        }catch(error) {
            return {data: "El producto no se agrego correctamente"};
        }
    }

    async getProduct(){
        try {
            const product = await productModel.find().lean();
            return product;
        } catch (error) {
            return "Error trying to retrieve the products";
        };
    }

    async getProductById(pid){
        const productById = await productModel.findById(pid);
        if(!productById){
            return "El producto buscado no existe";
        }else{
            return productById;
        };        
    }

    async updateProduct(pid, newdata){
        try {
            const updatedProduct = await productModel.findOneAndUpdate({ 
                _id: pid 
            },
                newdata,
            { 
                new: true 
            });
            const productsUpdate = await this.getProduct();
            return { data: productsUpdate , message: "El producto fue actualizado correctamente" };
        }catch (error) {
            return { message: "Error updating product" };
        }
    }

    async deleteProduct(pid){
        try{
            const productDelete= await productModel.deleteOne({ _id: pid });
            const newArrayProduct = await this.getProduct();
            return { data: newArrayProduct, mesagge:"producto eliminado correctamente" };
        }catch (error) {
            return { mesagge: "Error deleting product" };
        }
    }
}

export default productManagerDb;