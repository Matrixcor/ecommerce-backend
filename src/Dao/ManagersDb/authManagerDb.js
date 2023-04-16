import { Router, json, urlencoded , query } from "express";
import { userModel } from "../Models/user.Model.js";

class authManagerDb {

    async registerNewUser(email, password ){
        try{
            const userTocompare = await userModel.findOne({email: email});
            if(!userTocompare){
                const newUser = await userModel.create({email: email, password: password})
                if(email == "adminCoder@coder.com" && password == "adminCod3r123" ){
                    return { status: "succes", redirect: true , userAdmin: true ,message: "Registro existoso"}
                };
                return { status: "succes", redirect: true , userAdmin: false ,message: "Registro existoso"}
            }else{
                return { status: "error", redirect: false, message: "El nombre de usuario ingresado ya existe"}; //opcional redireccionar automaticamente al login
            }
        }catch(err){
            res.status(404).send(err);
        };
    }

    async loginUser(email, password){
        try{
            const userToLogin = await userModel.findOne({email: email, password: password});
            
            if(!userToLogin){
                return { status: "error", redirect: false, message: "El usuario buscado no existe"}
            }else{
                //pregunto si el usuario encontrado es admin
                //debo ocultar las contraseñas mediante hash
                if( userToLogin.email == "adminCoder@coder.com" && userToLogin.password == "adminCod3r123"){
                    return { status: "succes", redirect: true , userAdmin: true ,message: "Login existoso"}
                }
                return { status: "succes", redirect: true , userAdmin: false ,message: "Login existoso"}
            }
        }catch(err){
            res.status(404).send(err);
        };
    }
}

export default authManagerDb;