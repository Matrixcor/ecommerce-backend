import { enviromentOptions } from "../Config/enviroment.options.js";
import { authManagerDb } from "../Dao/Mongo/authManagerDb.js";
import { createHash, isValidPassword, createToken } from "../utils.js";
class authServices{

    static registerAuthService = async(first_name, last_name, email, age, password)=>{
        try{
            let userRole ;
            const userExist = await authManagerDb.getUser(email)
            if(userExist) return res.status(409).send("el usuario ya existe");

            //creamos el usuario
            if ( email == enviromentOptions.superAdmin.admin_email && password == enviromentOptions.superAdmin.admin_password){
                userRole = "superAdmin"
            }else{
                userRole = "user"
            }
            const newUser = {
                first_name, 
                last_name,
                email,
                age,
                password: createHash(password),
                cart:"",
                role: userRole
            };
            const createUser = await authManagerDb.userCreate(newUser);
            //generamos el token
            const dataForToken = { first_name, last_name, email, age, userRole};
            const accesToken = createToken({ dataForToken });
            return {status:"succes", payload: accesToken}
        }catch(error){
            return { status:"Error", message:" Error,can not create User"}
        }
        
    };
    
    static loginAuthService = async(data)=>{
        const { email, password }= data;
        const loginUser = await authManagerDb.getUser(email)
        if(isValidPassword(loginUser, password)){
            const { first_name,last_name,role }= loginUser;
            const user = { first_name,last_name,role, email};
            const token = createToken(user);
            return { status:"succes", payload: token}
        }else{
            return {status: "Error", message:"Invalid Credentials"};
        }
    };
    
};
export {authServices};