
class userRepository{
    constructor(dao){
        this.dao = dao;
    };
    async changeRoleService(uid, role){
        try {
            let newData;
            const userDb = await this.dao.getUser(uid);
            if(userDb.role == "user"){ newData = {role: "premium"}};
            if(userDb.role == "premium"){newData = {role: "user"}};
            const user = await this.dao.updateUserRole(uid, newData);
            return {status:"succes", user};
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