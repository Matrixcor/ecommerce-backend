import productModel from "../Mongo/Models/productModel.js";
import { paginate } from "mongoose-paginate-v2";

class productManagerDb {
    
    async addProduct (title, description, owner, price, code, status, category, stock, thumbnail){     
        try{
            await productModel.create({ title, description, owner, price, code, status, category, stock, thumbnail });
            const arrayProd = await productModel.find().lean();
            return arrayProd;
        }catch(error){
            return {status: "Error", message: "El producto no se agrego correctamente"};
        }
    };
    //get para ver si esta agregado el producto
    async getForSomeProduct(){
        const prod = await productModel.find().lean();
        return prod;
    };

    async getAllProduct(){
        //const products = await productModel.find().lean();
        const products = await productModel.paginate({},{});
        return {
            status: "succes", 
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
            
        };
    };

    async getFilterProduc(searchKey, filterOptions){
        try{
            const arrayProd= await productModel.paginate(searchKey, filterOptions);
            return arrayProd;
        } catch (error) {
            return "Error trying to retrieve the products";
        };
    };

    async getProdById(pid){
        const productById = await productModel.findById(pid);
        if(!productById){
            return {status:"Error", message:"El producto buscado no se encuentra"}
        }else{
            return {status:"succes", payload: productById};
        };        
    };

    async getViewProducts(){ // lo que trae trae productos para el view router
        const products = await productModel.find().lean();
        if(!products){
            return {status:"Error", message:"No se encontraron productos"}
        }
        return {status:"succes", payload: products};
    };

    async getViewOwnerProducts(owner){
        try {
            const ownerProd = await productModel.find({owner: owner}).lean();
            return {status:"succes", payload: ownerProd};
        } catch (error) {
            return {status:"Error", message:"No se encontraron productos"}
        }
    };

    async updateProduct(pid, newData){
        try {
            await productModel.findOneAndUpdate({ _id: pid},newData,{new: true});
            const productsUpdate = await productModel.find().lean();
            return {status:"succes", payload: productsUpdate};
        }catch (error) {
            return {status:"Error", message: "Error updating product"};
        }
    };

    async deleteProduct(pid){
        try{
            await productModel.deleteOne({ _id: pid });
            const newArrayProduct = await productModel.find().lean();
            return {status:"succes", payload: newArrayProduct };
        }catch (error) {
            return {Status:"Error", mesagge: "Error deleting product" };
        }
    };
}

export  {productManagerDb};