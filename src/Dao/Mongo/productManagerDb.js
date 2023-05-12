import productModel from "../Mongo/Models/productModel.js";
import { paginate } from "mongoose-paginate-v2";

class productManagerDb {
    
    static addProduct = async(title, description, price, code, status, category, stock, thumbnail)=>{        
        try{
            const res = await productModel.create({ title, description, price, code, status, category, stock, thumbnail });
            return {status:"succes", payload: res};
        }catch(error){
            return {status: "Error", message: "El producto no se agrego correctamente"};
        }
    };
    //get para ver si esta agregado el producto
    static getForSomeProduct = async()=>{
        const prod = await productModel.find().lean();
        return prod;
    };

    static getAllProduct = async()=>{
        const products = await productModel.find().lean();
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

    static getFilterProduc = async(searchKey, filterOptions)=>{
        try{
            console.log("filter prod")
            const product = await productModel.paginate( 
                searchKey , 
                filterOptions
            );
            return product;
        } catch (error) {
            return "Error trying to retrieve the products";
        };
    };

    static getProdById = async(pid)=>{
        const productById = await productModel.findById(pid);
        if(!productById){
            return {status:"error", message:"El producto buscado no se encuentra"}
        }else{
            return {status:"succes", payload: productById};
        };        
    };

    static getViewProducts = async()=>{ // lo que trae trae productos para el view router
        const products = await productModel.find().lean();
        if(!products){
            return {status:"error", message:"No se encontraron productos"}
        }
        return {status:"succes", payload: products};
    };

    static updateProduct = async(pid, newData, boolean)=>{
        try {
            await productModel.findOneAndUpdate({ _id: pid},newData,{new: boolean});
            const productsUpdate = await this.getProduct();
            return {status:"succes", payload: productsUpdate};
        }catch (error) {
            return {status:"error", message: "Error updating product"};
        }
    };

    static deleteProduct = async(pid)=>{
        try{
            await productModel.deleteOne({ _id: pid });
            const newArrayProduct = await this.getProduct();
            return {status:"succes", payload: newArrayProduct };
        }catch (error) {
            return {Status:"error", mesagge: "Error deleting product" };
        }
    };
}

export {productManagerDb};