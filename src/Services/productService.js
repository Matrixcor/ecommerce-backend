import {productManagerDb} from "../Dao/Mongo/productManagerDb.js";

class productService {
    static addProdService = async(newData)=>{
        try{
            const { title, description, price, code, status, category, stock, thumbnail } = newData;
            if(!title || !description || !price || !code || !status || !category || !stock || !thumbnail){
                return {status: "Error", mesagge:"complete todo los campos"};
            }
            //verifica si el producto ya esta en la DB
            const compare = await productManagerDb.getForSomeProduct();
            const  productWithSameCode = compare.some(
                (prod) => prod.code === code
            );
            if(productWithSameCode) return {status: "error",mesagge:"El Codigo ingresado ya existe, por favor elija otro."};
            
            const res = await productManagerDb.addProduct(title, description, price, code, status, category, stock, thumbnail );
            const product = await productManagerDb.getAllProduct();
            const listProd = res.status == "succes" ? res : product
            return listProd;
        }catch(error){
            return {status: "Error", message: "El producto no se agrego correctamente"};
        }
    };

    static getProdService = async (query, page, limit, sort)=>{
        try {
            let limitSearch = limit ? limit : 10;
            let pageSearch = page ? page : 1;
            let orderSearch = sort == "desc" ? -1 : sort == "asc"? 1 : false ;
            let searchKey = {};
            let newResult;

            // voy a pecar con el anidamiento de los condicionales
            query.title ? searchKey = {title: query.title} : query.price ? searchKey = {price: query.price}  : query.code ? searchKey = {code: query.code} : productManagerDb.getAllProduct();
            const filterOptions = { limit: limitSearch, page: pageSearch, sort: orderSearch};
            // solicito productos aplicando filtros

            const product = await productManagerDb.getFilterProduc(searchKey,filterOptions);
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
            return { status: "succes", payload: newResult }
        } catch (error) {
            return {status: "error", message:"Error trying to retrieve the products"};
        };
    };

    static getByIdProdService = async(pid)=>{  
        if(!pid) return {status: "error", message: "Ingrese un valor de ID"};
        const productById = await productManagerDb.getProdById(pid);
        return productById;
    };

    static updateProdService = async(pid, newData)=>{
        try{
            //verificar que no este vacio el pid ni el data
            const boolean = true;
            const productsUpdated = await productManagerDb.updateProduct(pid, newData, boolean);
            return {status:"succes", payload: productsUpdated, message:"Product has been updated"};
        }catch(err){
            return {status: "error", message:"This product do not be updated"};
        }
    };

    static deleteProdService = async(pid)=>{
        const productDeleted = await productManagerDb.deleteProduct(pid);
        if(productDeleted.status == "error") return {status:"error", message:"Error, Don't delete product"};
        return {status:"succes", payload: productDeleted, message: "Product has been deleted"};
    }
}

export { productService };