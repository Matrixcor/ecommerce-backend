import { userModel} from "./Models/user.Model.js"

class authManagerDb{

    async userCreate(newUser){
        const createUser = await userModel.create(newUser)
        return createUser;
    }
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
}

export { authManagerDb };