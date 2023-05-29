import {productManagerDb} from "../Dao/Mongo/productManagerDb.js";
import { viewServices, ticketServices } from "../Repository/index.Repository.js";

class viewsController {
    static homeViewController = async(req,res)=>{
        const homeProducts = await viewServices.homeGetProdService();
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
            const mostrar = await viewServices.cartGetViewProdService(cid);
            const prod = mostrar.products;
            req.io.emit("sendDataCart", prod);

            res.render("carts")
        }catch(error){
            res.json(error)
        }
    };

    static purchaseWebViewController = async(req,res)=>{
        try{
            const { cid } = req.params;
            res.render("purchase");
        }catch(error){
            res.render("error");
        }
    };

    static ticketViewController = async(req,res)=>{
        try {
            const {cid} = req.params
            const { email } = req.user;
            const prodTicket = await ticketServices.newTicketService(cid, email);
            res.render("tickets", prodTicket)
        } catch (error) {
            res.render("error"); 
        }
    }
    // vistas web
    
    static prodsViewController = async(req,res)=>{
        try{
            const {last_name, first_name, email, cart, role} = req.user;
            const dataLoginUser = {last_name, first_name, email, cart, role}; //puedo llamar a un DTO
            const data = await viewServices.webGetProdService();
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