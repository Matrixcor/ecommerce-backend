import { userModel} from "./Models/user.Model.js"

class userManagerDb{
    async getUser(uid){
        const result = await userModel.findOne({ _id: uid });
        return result;
    };
    async getUserByEmail(email){
        const result = await userModel.findOne({ email: email });
        return result;
    };
    async updateUserRole(uid, newData){
        try{
            const _id = uid;
            const userUpdate = await userModel.findOneAndUpdate({ _id },newData,{new: true});
            return {status:"succes", payload: userUpdate};
        }catch (error) {
            return {status:"error", message: "Error updating User"};
        }
    };
    async getAllUsers(){
        try {
            const arrayUsers = await userModel.find({},{first_name: 1, email: 1, role: 1});
            return arrayUsers;
        } catch (error) {
            return {status:"error", message: "Error getting User"};
        }
    }
    async deleteInactive(valorBusqueda){
        const usersToDelete = await userModel.find({last_connection: {$lte: valorBusqueda}},{first_name: 1, email: 1, role: 1})
        const deleteUsers = await userModel.deleteMany({last_connection: {$lte: valorBusqueda}});
        return usersToDelete ;
    }
};
export {userManagerDb};
