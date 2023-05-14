import {productManagerDb} from "../Dao/Mongo/productManagerDb.js";
import { viewsService } from "../Services/views.Service.js";
import cartManagerDb from "../Dao/Mongo/cartManagerDb.js";

const groupProducts = new productManagerDb();
const groupCarts = new cartManagerDb();

class viewsController {
    static homeViewController = async(req,res)=>{
        const homeProducts = await viewsService.homeGetProdService();
        const arrayProd = homeProducts.payload;
        res.render("home", {arrayProd});
    };

    static realTimeViewController = async(req,res)=>{
      const realTimeArray = [];
        res.render('real_time_products', realTimeArray);
    };
    
    static chatViewController= async(req,res)=>{
        try{
            res.render("chat");
        }catch(error){
            res.render("error");
        }
    };
    //hasta aca bien

    static cartProdViewController = async(req,res)=>{
        try{
            const { cid } = req.params;
            const cartsArray = await groupCarts.getProductsInCart(cid);
            let prod = [];
            for(let i=0 ; i< cartsArray.products.length ; i++){
                const objt = { 
                    id: cartsArray.products[i].product._id,
                    quantity: cartsArray.products[i].quantity
                };
                prod.push({...objt})
            }
            res.render("carts",{prod});
    
        }catch(error){
            res.render("error");
        }
    };
    
    // vistas web
    
    static prodsViewController = async(req,res)=>{
        try{

            const {last_name, first_name, email, role} = req.user; 
            const dataLoginUser = {last_name, first_name, email, role};
            console.log(dataLoginUser)
        

            const data = await viewsService.webGetProdService();
            const arrayProd = data.payload;
            const info = { arrayProd, dataLoginUser}
            res.render("products", {info});
        }catch(error){
            res.render("error");
        }
    };
    
    static loginViewController = async(req,res)=>{
        try{
            res.render("login");
        }catch(error){
            res.render("error");
        }
    };
    
    static registerViewController = async(req,res)=>{
        try{
            res.render("register");
        }catch(error){
            res.render("error");
        }
    };
    
    static profileViewController = async(req,res)=>{
        try{
            const dataUser = req.body;
            res.render("profile");
        }catch(error){
            res.render("error");
        }
    };
}

export { viewsController };