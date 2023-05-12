import { productManagerDb } from "../Dao/Mongo/productManagerDb.js";

class viewsService {
    static homeGetProdService = async()=>{
        const prod = await productManagerDb.getViewProducts();
        return prod;
    }
}

export {viewsService};