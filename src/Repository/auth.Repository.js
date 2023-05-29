import { enviromentOptions } from "../Config/enviroment.options.js";
import { createUserDto, generateUserForTokenDto } from "../Dao/Dto/auth.dto.js";
import { isValidPassword, createToken } from "../utils.js";

class authRepository{
    constructor(dao){
        this.dao = dao;
    };
   
    async registerAuthService(data){
        try{
            let role ;
            const { first_name, last_name, email, age, password } = data;
            if(!first_name || !last_name || !email || !age || !password) return {status: "Error", mesagge:"complete todo los campos"};
            const userExist = await this.dao.getUser(email)
            if(userExist) return res.status(409).send("el usuario ya existe");
            ((email === enviromentOptions.superAdmin.admin_email)  && (password === enviromentOptions.superAdmin.admin_password )) ? role = "admin" : role = "user"
            const newUser = new createUserDto(data, role); //utilizo un dto para filtrar datos
            const user = await this.dao.userCreate(newUser); //creamos el usuario
            const dataForToken =  new generateUserForTokenDto(newUser);  //generamos el token
            const accesToken = createToken({ dataForToken });
            return {status:"succes", payload: accesToken};
        }catch(error){
            return {status:"Error", message:" Error,can not create User"}
        }
    };
    
    async loginAuthService(data){
        const { email, password }= data;
        const loginUser = await this.dao.getUser(email);
        if(isValidPassword(loginUser, password)){
            const dataForToken = new generateUserForTokenDto(loginUser);
            const accesToken = createToken({...dataForToken});
            return {status:"succes", payload: accesToken}
        }else{
            return {status: "Error", message:"Invalid Credentials"};
        }
    };

    async updateProfileUser(email, newData){
        const key = email.email;
        const updatedUser = await this.dao.updateUser(key, newData)
        
        const dat = new generateUserForTokenDto(updatedUser.payload)
        const newUserToken = createToken({...dat})
        return {status:"succes", newUserToken}  
    }   
};
export {authRepository};