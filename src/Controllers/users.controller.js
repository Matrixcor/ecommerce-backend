import { userServices } from "../Repository/index.Repository.js";

class userController{
    static changeRoleController = async(req, res)=>{
        try {
            const {uid} = req.params;
            const { role } = req.user; // puedo sacar el role desde el authenticate, pero 
            const changed = await userServices.changeRoleService(uid, role);
            res.send("exitoso");
        } catch (error) {
            res.send(error);
        }
        
    };
    static uploadDocsController = async(req, res)=>{ // en construccion falta guardar docs en la db
        try {
            const {uid} = req.params;
            const { role } = req.user; // puedo sacar el role desde el authenticate, pero 
            
            const docs = req.files.map(doc=>({name: doc.originalname, reference: doc.filename}));
            res.send("exitoso");
        } catch (error) {
            res.send(error);
        }
        
    };
};

export {userController};