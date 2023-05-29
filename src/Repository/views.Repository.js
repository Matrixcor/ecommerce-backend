import { cartServices } from "./index.Repository.js";

class viewsRepository {
    constructor(dao){
        this.dao = dao;
    };

    async homeGetProdService(){
        const prod = await this.dao.getViewProducts();
        return prod;
    };

    async webGetProdService(){
        try{
            const arrayViewProd = await this.dao.getViewProducts();
            return arrayViewProd;
        }catch(error){
            res.render("error");
        }
    }
    
    async cartGetViewProdService(cid){
        const cartArray = await cartServices.getProdCartService(cid);
        return cartArray;
    }
   
}

export { viewsRepository };