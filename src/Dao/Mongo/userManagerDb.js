import { userModel} from "./Models/user.Model.js"

class userManagerDb{
    async getUser(uid){
        const result = await userModel.findOne({ _id: uid });
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
};
export {userManagerDb};
