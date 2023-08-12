
class userRepository{
    constructor(dao){
        this.dao = dao;
    };
    async getUsersService(){
        try {
            const users = await this.dao.getAllUsers();
            return {status: "succes", payload: users};
        } catch (error) {
            return {status: "Error", message: "No se pudieron obtener todos los usuarios"}
        }
    }
    async deleteInactiveUserService(){
        try {
            let fechaActual = new Date();
            let periodoInactivo = 1000*60*60*24*2;
            let valorBusqueda = fechaActual.getTime() - periodoInactivo;

            const deleted = await this.dao.deleteInactive(valorBusqueda);
            return {status: "succes", payload: deleted};
        } catch (error) {
            return {status: "Error", message: "No se pudieron eliminar todos los usuarios inactivos"}
        }
    };
    async changeRoleService(uid){
        try {
            let newData;
            const userDb = await this.dao.getUser(uid);
            if(userDb.role == "admin"){ return {status: "Error", message: "No puede cambiar el rol a un usuario del tipo administrador"}}
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
            return {status:"succes", payload: user}
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