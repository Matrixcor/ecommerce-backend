import { currentLogger } from "./logger.js";

const logger = currentLogger();

class productRepository {
    constructor(dao){
        this.dao = dao;
    };

    async addProdService(newData){
        try{
            const { title, description, owner, price, code, status, category, stock, thumbnail } = newData;
          
            const compare = await this.dao.getForSomeProduct();  //verifica si el producto ya esta agregado
            const  productWithSameCode = compare.some( (prod) => prod.code === code );
            if(productWithSameCode) {
                logger.warning("El codigo de producto ingresado ya existe");
                return {status: "Error",mesagge:"El Codigo ingresado ya existe, por favor elija otro."};
            }
            const listProd = await this.dao.addProduct(title, description,owner, price, code, status, category, stock, thumbnail );
            return {status: "succes", payload: listProd};
        }catch(error){
            logger.error("Error en addProdService - no se pudo Agregar el producto");
            return {status: "Error", message: "El producto no se agrego correctamente"};
        }
    };

    async getProdService(query, page, limit, sort){
        try {
            let limitSearch = limit ? limit : 10;
            let pageSearch = page ? page : 1;
            let orderSearch = sort == "desc" ? -1 : sort == "asc"? 1 : false ;
            let searchKey;
            let newResult;
            let product;
            // voy a pecar con el anidamiento de los condicionales
            query.title ? searchKey = {title: query.title} : query.price ? searchKey = {price: query.price}  : query.code ? searchKey = {code: query.code} : product = await this.dao.getAllProduct(); // si no hay parametros traigo todos los productos
            const filterOptions = { limit: limitSearch, page: pageSearch, sort: orderSearch}; // armo el filtro si el request tiene algun parametro
            
            if(searchKey != null) {
                product = await this.dao.getFilterProduc(searchKey,filterOptions);
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
                return { status: "succes", payload: newResult}
            } 
            return {status: "succes", payload: product.payload}
        } catch (error) {
            logger.error("Error en getProdService - no se pudo obtener el producto");
            return {status: "Error", message:"Error trying to retrieve the products"};
        };
    };

    async getByIdProdService(pid){  
        const productById = await this.dao.getProdById(pid);
        return productById;
    };

    async updateProdService(pid, newData){
        try{
            const { title, description, price, code, status, category, stock, thumbnail } = newData; //verificamos que no este vacio el pid ni el data
            if(!title || !description || !price || !code || !status || !category || !stock || !thumbnail){
                return {status: "Error", mesagge:"Verifique Los datos ingresados"};
            }
            const productsUpdated = await this.dao.updateProduct(pid, newData);
            return {status:"succes", payload: productsUpdated, message:"Product has been updated"};
        }catch(error){
            logger.error("Error en updateProdService - no se pudo actualizar el producto");
            return {status: "Error", message:"This product do not be updated"};
        }
    };

    async deleteProdService(pid){
        const productDeleted = await this.dao.deleteProduct(pid);
        if(productDeleted == "Error") return {status:"Error", message:"Error, Don't delete product"};
        return {status:"succes", payload: productDeleted, message: "Product has been deleted"};
    }
}

export { productRepository };