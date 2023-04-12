import { Router, json, urlencoded , query } from "express";
import { userModel } from "../Models/user.Model.js";

class authManagerDb {
    
    async registerNewUser(email, password ){
        try{
            const userTocompare = await userModel.findOne({email: email});
            if(!userTocompare){
                const newUser = await userModel.create({email: email, password: password})
                req.session.user = newUser.email;
                req.session.rol = newUser.rol;
                if(email == "adminCoder@coder.com"){ // ver porque va en login
                    req.session.rol = "isAdmin";
                }
                return { redirect: true , message: "Registro existoso"};
            }else{
                return { redirect: false,message: "El nombre de usuario ingresado ya existe"}; //opcional redireccionar automaticamente al login
            }
        }catch(err){
            res.status(404).send(err);
        };
    }

    async loginUser(email, password){
        try{
            const userToLogin = await userModel.findOne({email: email, password: password});
            console.log(userToLogin)
                if(!userToLogin){
                    return { redirect: false, message: "El usuario buscado no existe"}
                }else{
                    res.send(" no es null")
                    //pregunto si el usuario encontrado es admin
                    //debo ocultar las contraseñas mediante hash
                    if( (userToLogin.email == "adminCoder@coder.com") && userToLogin.password == "adminCod3r123"){
                        req.session.user = email;
                        req.session.rol = "isAdmin";
                    }else{
                        req.session.user = email;
                        req.session.rol = "user";
                    }
                    console.log(userToLogin)
                    return { redirect: true, message: "Login exitoso"}
                }
        }catch(err){
            res.status(404).send(err);
        };
    }

}

export default authManagerDb;