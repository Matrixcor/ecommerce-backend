import { query } from "express";
import productModel from "../Models/productModel.js";
import { paginate } from "mongoose-paginate-v2";

class productManagerDb {
    
    async addProduct(newData){
        
        try{
            const { title, description, price, code, status, category, stock, thumbnail } = newData;
            if(!title || !description || !price || !code || !status || !category || !stock || !thumbnail){
                return {status: "Error", mesagge:"complete todo los campos"};
            }
            
            const productsToAdd = await productModel.create({ title, description, price, code, status, category, stock, thumbnail });
            const productsAdd = await this.getProduct();
            return {status: "succes", payload: productsAdd, mesagge:"producto agregado correctamente"};
        }catch(error) {
            return {status: "Error", message: "El producto no se agrego correctamente"};
        }
    }

<<<<<<< HEAD
    async getProduct(query, page, limit, sort){
        try {
            let limitSearch = limit ? limit : 10;
            let pageSearch = page ? page : 1;
            let orderSearch = sort == "desc" ? -1 : sort == "asc"? 1 : false ;
            let searchKey = {};
            let newResult;

            async function getallProduct(){
                const products = await productModel.find().lean();
                return {status: "succes", 
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
            }

            // voy a pecar con el anidamiento de los condicionales
            query.title ? searchKey = {title: query.title} : query.price ? searchKey = {price: query.price}  : query.code ? searchKey = {code: query.code} : getallProduct()
            const filterOptions = { limit: limitSearch, page: pageSearch, sort: orderSearch};

            const product = await productModel.paginate( 
                searchKey , 
                filterOptions
            );
            const result = {
                payload: product.docs,
                totalPages: product.totalPages,
                prevPage: product.prevPage,
                nextPage: product.nextPage,
                page: product.page,
                hasPrevPage: product.hasPrevPage,
                hasNextPage: product.hasNextPage,
            };
            if(product.hasPrevPage == false & product.hasNextPage == false){
                newResult = { ...result, 
                    prevLink: null,
                    nextLink: null 
                }
            }else{
                newResult = { ...result, 
                    prevLink: product.prevLink,
                    nextLink: product.nextLink 
                }
            }
            return { status: "succes",...newResult}
=======



    async getProduct(title, page, limit, sort){
        try {
            let limitSearch = limit ? limit : 10;
            let pageSearch = page ? page : 1;
            let orderSearch = sort ? {price: sort} : false ;
            
            let searchKey = { title }
// ver como obtener el valor del query para poder hacer la busqueda
            console.log("query",searchKey.title)
            
        function searchK(str){
            const words = str.split("-");
            const wordsToUpper = words.map((p)=>
                p[0].toUpperCase() + p.slice(1)
            )
            const newsearchKey = wordsToUpper.join(" ")
            return (newsearchKey)
        };
            const ver = searchK(searchKey.title);
        console.log("devuelve ",ver)

          /*  
            const filterOptions = { limit: limitSearch, page: pageSearch, sort: orderSearch};

            const product = await productModel( 
                {[searchKey] : [searchKeyValue]}, 
                filterOptions
            )
*/
            //const product = await productModel.find().lean();
            return " ingresa al endpoint";
>>>>>>> dbb7ca6f5aa706bd5eb215a5d3a8c12ba517f686
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