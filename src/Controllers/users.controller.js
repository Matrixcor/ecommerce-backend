import { userServices, authServices } from "../Repository/index.Repository.js";

class userController{
    static changeRoleController = async(req, res)=>{
        try {
            const {uid} = req.params; 
            const changed = await userServices.changeRoleService(uid);
            if(changed.status != "Error"){
                res.cookie("cookie-token", changed.payload, {maxAge: 60*60*1000, httpOnly: true});
                res.redirect("/profile");
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
            if(docs.length == 3){user.status = "completo"};
            if((docs.length != 0) && docs.length < 3){
                user.status = "pendiente"
            }else{
                user.status = "incompleto"
            };
            const emailuser = { email: email }; //solucionar este formato cuando traslade el update user de auth este dao
            const conn = authServices.updateProfileUser(emailuser, user);

            res.send("exitoso");
        } catch (error) {
            res.send(error);
        }
        
    };
};

export {userController};