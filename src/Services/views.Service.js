import { productManagerDb } from "../Dao/Mongo/productManagerDb.js";

class viewsService {
    static homeGetProdService = async()=>{
        const prod = await productManagerDb.getViewProducts();
        return prod;
    };

    static webGetProdService = async()=>{
        try{
            const arrayViewProd = await productManagerDb.getViewProducts();
            return arrayViewProd;
        }catch(error){
            res.render("error");
        }
    }
   
}

export {viewsService};