import { Router, json, urlencoded , query } from "express";
import { createHash , isValidPassword } from "../../utils.js";
import { userModel } from "../Models/user.Model.js";

class authManagerDb {
/*

como la logica esta en passport config -- comento esto. 


    async registerNewUser(email, password){
        try{
            const userTocompare = await userModel.findOne({user: email});

            if(!userTocompare){
                const newUser = {
                    email: email,
                    password: createHash(password)
                }
                return { status: "succes", redirect: true ,message: "Registro existoso"}
            }else{
                return { status: "error", redirect: false, message: "El nombre de usuario ingresado ya existe"}; //opcional redireccionar automaticamente al login
            }
        }catch(err){
            res.status(404).send(err);
        };
    }

    async loginUser(email, password){
        try{
            const userToLogin = await userModel.findOne({email: email});
            
            if(!userToLogin){
                return { status: "error", redirect: false, message: "El usuario buscado no existe"}
            }else{

                if(isValidPassword(userToLogin, password)){
                    const loginToken = createToken({email}) //aca puedo agregar lo del admin

                    return { status: "succes", payload: {loginToken} ,redirect: true , userAdmin: false ,message: "Login existoso"}
                }else{
                    return { status: "succes", redirect: false, message: "los datos ingresados son incorrectos"} //podria especificar mejor el error
                }
            };

        }catch(err){
            res.status(404).send(err);
        };
    }
    */
}

export default authManagerDb;