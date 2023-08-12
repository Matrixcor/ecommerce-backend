import { userModel} from "./Models/user.Model.js"

class authManagerDb{
    
    async getUser(email){
        const result = await userModel.findOne({ email: email });
        return result;
    }

    async updateUser(key, newData){
        try{
            const email = key;
            const productsUpdate = await userModel.findOneAndUpdate({ email },newData,{new: true});
            return {status:"succes", payload: productsUpdate};
        }catch (error) {
            return {status:"error", message: "Error updating product"};
        }
    }
    async userCreate(newUser){
        const user = await userModel.create(newUser);
        return user;
    };
}

export { authManagerDb };