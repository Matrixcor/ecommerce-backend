import { createToken } from "../utils.js";
import { generateUserForTokenDto } from "../Dao/Dto/auth.dto.js";
class userRepository{
    constructor(dao){
        this.dao = dao;
    };
    async changeRoleService(uid){
        try {
            let newData;
            const userDb = await this.dao.getUser(uid);
            if(userDb.role == "premium"){
                newData = {role: "user"}
            }else{
                if(userDb.role == "user" && userDb.status == "completo"){
                    newData = {role: "premium"}
                }else{
                    return {status:"Error", message: "Error updating, El usuario no ha terminado de cargar toda la documentacion"};
                };
            };
            const user = await this.dao.updateUserRole(uid, newData);
            const dat = new generateUserForTokenDto(user.payload);
            const newUserToken = createToken({...dat});
            
            return {status:"succes", payload: newUserToken}
        } catch (error) {
            return {status:"error", message: "Error updating User"};
        }
    }
    async userByEmailService(email){
        const result = await this.dao.getUserByEmail(email);
        return result;
    };
};
export {userRepository};