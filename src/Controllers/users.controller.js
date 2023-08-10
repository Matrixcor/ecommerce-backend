import { userServices, authServices } from "../Repository/index.Repository.js";
import { transporter } from "../Config/email.config.js";
import { emailTemplateDeleteUsers } from "../Templates/email.Templates.js";

class userController{
    static getAllUsersController = async(req,res)=>{
        try {
            console.log("ingresa al endpoint")
            const allUsers = await userServices.getUsersService();
            console.log("tosod los usuarios ", allUsers)
            res.json(allUsers)
        } catch (error) {
            res.send(error);
        }
    }
    static deleteInactiveUsers = async(req,res)=>{
        try {
            const inactiveUsers = await userServices.deleteInactiveUserService();
            if(inactiveUsers.status != "Error" && inactiveUsers.payload.length != 0){
                inactiveUsers.payload.forEach(async (element) => {
                    console.log("element: ", element)
                    const content = await transporter.sendMail({
                        from: "Servicio de notificaciones Ecommerce - Backend ",
                        to: element.email, //es el correo del usuario eliminado
                        subject: "Eliminacion de cuenta por inactividad",
                        html: emailTemplateDeleteUsers
                    });
                });
            }
            res.json(inactiveUsers)
        } catch (error) {
            res.send(error);
        }
    }

    static changeRoleController = async(req, res)=>{
        try {
            const {uid} = req.params;
            const changed = await userServices.changeRoleService(uid);
            if(changed.status != "Error"){
                res.redirect("/control-panel"); // utilizar socket para actualizar la tabla
            }else{
                res.send(changed.message)
            }
        } catch (error) {
            res.send(error);
        }
        
    };
    static uploadDocsController = async(req, res)=>{
        try {
            let docs = [];
            const {email} = req.user;
            const user = await userServices.userByEmailService(email);
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['comprobante-domicilio']?.[0] || null;
            const cuenta = req.files['comprobante-cuenta']?.[0] || null;
            
            if(identificacion){docs.push({name: 'identificacion', reference: identificacion.filename})};
            if(domicilio){docs.push({name: 'comprobante-domicilio', reference: domicilio.filename})};
            if(cuenta) {docs.push({name: 'comprobante-cuenta', reference: cuenta.filename})};
            user.documents = docs;
           
            if(docs.length == 3){ user.status = "completo"};
            if((docs.length != 0) && docs.length < 3){ user.status = "pendiente" };
            if(docs.length == 0){ user.status = "incompleto" };
            console.log(user)
            const emailuser = { email: email }; //solucionar este formato cuando traslade el update user de auth este dao
            const conn = await authServices.updateProfileUser(emailuser, user);
            res.send("exitoso");
        } catch (error){
            res.send(error);
        }
        
    };
};

export {userController};