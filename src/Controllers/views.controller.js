import { viewServices, ticketServices } from "../Repository/index.Repository.js";
import { transporter } from "../Config/email.config.js"
import { emailTemplateTickets } from "../Templates/email.Templates.js"
import { generateProducts } from "../utils.js";
import { currentLogger } from "../Repository/logger.js";

const logger = currentLogger();

class viewsController {
    static homeViewController = async(req,res)=>{
        const homeProducts = await viewServices.homeGetProdService();
        const arrayProd = homeProducts.payload;
        res.render("home", {arrayProd});
    };

    static cartProdViewController = async(req,res)=>{ //muestra el carrito con el boton
        try{
            const { cid } = req.params;
            const mostrar = await viewServices.cartGetViewProdService(cid);
            const prod = mostrar.products;
        
            req.io.emit("sendDataCart", prod);
            res.render("carts");
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
            const prodTicket = await ticketServices.newTicketService(cid, email); // genero el ticket y devuelvo para renderizar en el cliente
             
            if(prodTicket.status !== "Error"){
                const templateTicket = await emailTemplateTickets(prodTicket);
                const content = await transporter.sendMail({
                    from: "Servicio de notificaciones Ecommerce - Backend ",
                    to: email,   //userName es el correo del usuario registrado
                    subject: "Servicio de notificaciones Ecommerce - Backend",
                    html: templateTicket
                });
                logger.info("Email creado correctamente");
            }
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
            logger.warning("Error en registerViewController")
            res.render("error");
        }
    };
    
    static panelViewController = async (req,res)=>{
        try {
            
            res.render("panelControl")
        } catch (error){
            res.render("error")
        }
    };

    static profileViewController = async(req,res)=>{
        try{
            const dataUser = req.user;
            const uid = await viewServices.getUserDbService(dataUser.email);
            const data = { ...dataUser, uid: uid._id}
            res.render("profile", {data});
        }catch(error){
            res.render("error");
        }
    };

    static profileCreateViewController = (req,res)=>{
        try {
            res.render("createprod");
        } catch (error) {
            res.render("error");
        }
    };

    static profileDeleteViewController = async(req,res)=>{
        try {
            let data;
            const {last_name, first_name, email, cart, role} = req.user;      //aca debo cargar los productos creados por el owner, por lo tanto debo saber que tipo de usuario es
            const dataLoginUser = {last_name, first_name, email, cart, role}; //puedo llamar a un DTO
            //aca deberia colocar el filtro para mostrar, si es admin traer todos los productos

            (role == "admin") ? data = await viewServices.webGetProdService() : data = await viewServices.WebGetOwnerProdService(email); //hasta aca trae los productos del owner para eliminar
            const arrayProd = data.payload;
            const info = { arrayProd, dataLoginUser}

            res.render("deleteprod", {info});
        } catch (error) {
            res.render("error");
        }
    };
}

export { viewsController };