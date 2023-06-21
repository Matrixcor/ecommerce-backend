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
    
    static chatViewController= async(req,res)=>{
        try{
            res.render("chat");
        }catch(error){
            res.render("error");
        }
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

    static mockingProdsController = async(req,res)=>{
        try {
            const cant = req.query.cant || 50;
            let arrayProds = [];
            for(let i=0 ; i< cant ; i++){
                const prods = await generateProducts();
                arrayProds.push(prods);
            }
            logger.info("Mocking generado exitosamente");
            res.json({arrayProds});
        } catch (error) {
            res.render("error");  
        }
    }

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

    static recoveryViewController = async(req,res)=>{
        try {
            res.render("restore");
        } catch (error){
            logger.warning("Error en el recoveryViewController")
            res.render("error");
        }
    }

    static restoreViewController = async(req,res)=>{
        try {
            const token = req.query.token;
            //renderizo la vista
            res.render("newpass", {token})
        } catch (error) {
            res.render(error)
        }
    }
    
    static profileViewController = async(req,res)=>{
        try{
            const dataUser = req.body;
            console.log(dataUser)
            res.render("profile");
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
            //aca deberia colocar el filtro para motrar, si es admin traer todos los productos
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