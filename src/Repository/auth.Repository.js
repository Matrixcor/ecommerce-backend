import { enviromentOptions } from "../Config/enviroment.options.js";
import { createUserDto, generateUserForTokenDto, generateEmailForTokenDto } from "../Dao/Dto/auth.dto.js";
import { createHash } from "../utils.js";
import { isValidPassword, createToken, createEmailToken } from "../utils.js";
import { currentLogger } from "./logger.js";

const logger = currentLogger();

class authRepository{
    constructor(dao){
        this.dao = dao;
    };
   
    async registerAuthService(data){
        try {
            let role ;
            const { email, password } = data;
            const userExist = await this.dao.getUser(email)
            if(userExist) return {status: "Error", message:"El usuario ya existe"};

            ((email === enviromentOptions.superAdmin.admin_email)  && (password === enviromentOptions.superAdmin.admin_password )) ? role = "admin" : role = "user"
            const newUser = new createUserDto(data, role); //utilizo un dto para filtrar datos
            const user = await this.dao.userCreate(newUser); //creamos el usuario
            const dataForToken =  new generateUserForTokenDto(newUser);  //generamos el token
            const accesToken = createToken({ dataForToken });
            logger.debug("Registro exitoso - recibio: first_name, last_name, email, age, password, genero el Token de acceso y lo devuelve al controler");
            logger.info("El usuario se creo correctamente");
            return {status:"succes", payload: accesToken};
        } catch (error) {
            return {status: "Error", message:"Can not register User"};
        }
    };
    
    async loginAuthService(data){
        try {
            const { email, password }= data;
            
            const loginUser = await this.dao.getUser(email);
            if(!loginUser) return {status: "Error", message:"El usuario no existe"};

            if(isValidPassword(loginUser, password)){
                loginUser.last_connection = new Date();
                const updtUser = this.dao.updateUser(email, loginUser);

                const dataForToken = new generateUserForTokenDto(loginUser);
                const accesToken = createToken({...dataForToken});
                logger.debug("log exitoso - recibio email y password, genero el Token de acceso y lo devuelve al controler");
                return {status:"succes", payload: accesToken}
            }else{
                logger.debug("log fallido - recibio email y password pero alguno es incorrecto, no genera el Token");
                return {status: "Error", message:"Invalid Credentials"};
            }
        } catch (error) {
            return {status: "Error", message:"Can not Login User"};
        }
    };

    async restorePassService(email){ //genero el token
        try {
            const loginUser = await this.dao.getUser(email);
            if(!loginUser) return {status: "Error", message:"El usuario no existe"};
            const data = new generateEmailForTokenDto(loginUser)
            const expireTime = 60*60;
            const emailToken = createEmailToken(data, expireTime);
            return { status: "succes", emailToken}
        } catch (error) {
            return {status: "Error", messge:"no se pudo generar el token, o no se eoncontro el usuario"}
        }
    };

    async newPassService(data, password){
        try {
            const email = data.email;
            const user = await this.dao.getUser(email);
            if(isValidPassword(user, password)){return {status: "Error", messge:"Las contraseñas no deben ser iguales"}}//quiere decir que son iguales las password
            const newData = {password: createHash(password)}
            const userUpdated = await this.updateProfileUser(data, newData);

        } catch (error) {
            return {status: "Error", messge:"no se pudo actualizar la contraseña"}
        }
    };

    async updateProfileUser(email, newData){
        try {
            const key = email.email;
            const updatedUser = await this.dao.updateUser(key, newData);
            
            const dat = new generateUserForTokenDto(updatedUser.payload);
            const newUserToken = createToken({...dat});
            return {status:"succes", newUserToken}
        } catch (error) {
            return {status: "Error", message:"Can not Update User profile"};
        } 
    };
};

export {authRepository};