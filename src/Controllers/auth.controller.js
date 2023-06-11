import { authServices } from "../Repository/index.Repository.js";
import { transporter } from "../Config/email.config.js";
import { emailTemplateLogin } from "../Templates/email.Templates.js";

import { customErrorRepository } from "../Repository/errorService/customError.Repository.js";
import { generateUserRegErrorInfo, generateUserLogErrorInfo, authLogErrorInfo } from "../Repository/errorService/errorGenerate.Repository.js"
import { EError } from "../Enums/EError.js";
import { currentLogger } from "../Repository/logger.js";

const logger = currentLogger();

class authController{

    static registerAuthController = async(req,res, next)=>{
        try {
            const data = req.body;
            const { first_name, last_name, email, age, password } = data;

            if(!first_name || !last_name || !email || !age || !password) {
                logger.error("Error en registerAuthController - Datos incompletos")
                customErrorRepository.createError({
                    name: "User Register Error",
                    cause: generateUserRegErrorInfo(data),
                    message: "Error, Faltan algunos campos, o el formato ingresado no es correcto",
                    errorCode: EError.INVALID_TYPES_ERROR
                });
            }

            const userName = req.body.email;
            const userCreated = await authServices.registerAuthService(data);

            if(userCreated.status !== "Error"){
                res.cookie("cookie-token", userCreated.payload, {maxAge: 60*60*1000, httpOnly: true});
                const content = await transporter.sendMail({
                    from: "Servicio de notificaciones Ecommerce - Backend ",
                    to: userName, //es el correo del usuario registrado
                    subject: "Registro exitoso",
                    html: emailTemplateLogin
                });
                logger.info("Usuario registrado con exito");
                res.redirect("/products");
            }else{
                logger.warning("El usuario ya existe en la base de datos");
                logger.error("Error en registerAuthController - Usuario existente");
                res.status(409).json(userCreated.message);
            }
        } catch (error) {
            next(error);
        }
        
    };
    
    static loginAuthController = async(req,res,next)=>{
        try {
            const data = req.body;
            const {email, password} = data;
            
            if(!email || !password) {
                logger.warning("Faltan datos para realizar el loggin");
                logger.error("Error en loginAuthController - Campos incompletos");
                customErrorRepository.createError({
                    name: "User Login Error",
                    cause: generateUserLogErrorInfo(data),
                    message: "Error, Faltan algunos campos, o el formato ingresado no es correcto",
                    errorCode: EError.INVALID_TYPES_ERROR
                });
            };
            const logRes = await authServices.loginAuthService(data);

            if(logRes.status !== "Error"){
                logger.info("El usuario se loggeo correctamente");
                res.cookie("cookie-token", logRes.payload, {maxAge: 60*60*1000, httpOnly: true});
            }else{
                logger.warning("El email ingresado o el password son incorrectos")
                logger.error("Error en loginAuthController - datos incorrectos");
                customErrorRepository.createError({
                    name: "User Login Error",
                    cause: authLogErrorInfo(data),
                    message: "Error, los datos ingresados son incorrectos",
                    errorCode: EError.AUTH_ERROR
                });
            };
            res.redirect("/products");
        } catch (error) {
            next(error);
            //res.status(409).json({error});
        }
    };
    
    static currentAuthController = async(req,res)=>{ //info que contiene el token desactualizado
        const {last_name, first_name, email, cart, role} = req.user;
        res.json({...req.user});
    };
    
    static gitLogAuthController =  (req,res)=>{
        res.json("redireccion exitosa")
    };
    
    static gitFailAuthController = (req,res) =>{
        res.redirect("/products")
    };
    
    static logOutAuthController = async(req,res)=>{
        res.clearCookie("cookie-token");  //elimino el token del usuario
        res.redirect("/login"); //debo redireccionar a login
    };
}
export {authController};