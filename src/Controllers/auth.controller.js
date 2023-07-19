import { authServices } from "../Repository/index.Repository.js";
import { transporter } from "../Config/email.config.js";
import { emailTemplateLogin, emailTemplateRecovery } from "../Templates/email.Templates.js";

import { customErrorRepository } from "../Repository/errorService/customError.Repository.js";
import { generateUserRegErrorInfo, generateUserLogErrorInfo, authLogErrorInfo } from "../Repository/errorService/errorGenerate.Repository.js"
import { EError } from "../Enums/EError.js";
import { currentLogger } from "../Repository/logger.js";
import { verifyEmailToken } from "../utils.js";

const logger = currentLogger();

class authController{

    static registerAuthController = async(req,res, next)=>{
        try {
            const data = req.body;
            const file = req.file.path;
            const { first_name, last_name, email, age, password } = data;
            const newData = { ...data, avatar: file }
            
            if(!first_name || !last_name || !email || !age || !password || !file) {
                logger.error("Error en registerAuthController - Datos incompletos")
                customErrorRepository.createError({
                    name: "User Register Error",
                    cause: generateUserRegErrorInfo(data),
                    message: "Error, Faltan algunos campos, o el formato ingresado no es correcto",
                    errorCode: EError.INVALID_TYPES_ERROR
                });
            }

            const userName = req.body.email;
            const userCreated = await authServices.registerAuthService(newData);

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
    static restorePass = async(req,res,next)=>{ //aca genero el toke
        //recibo el email, verifico que existe el usuario y recien genero token
        try {
            const { email } = req.body;
            const token = await authServices.restorePassService(email);
            const recoveryLink = `http://localhost:8080/restore?token=${token.emailToken}`; // es el link del render view del formulario
            const content = await transporter.sendMail({ // luego envio al email el link con el token
                from: "Servicio de notificaciones Ecommerce - Backend",
                to: email, //es el correo del usuario registrado
                subject: "Recuperacion de contraseña",
                html: emailTemplateRecovery(recoveryLink) //cambiar el template
            });
            res.json({message:"exitoso token"})
        } catch (error) {
           //next(error);
           res.send("error en restorepassword")
        }
    };

    //genero funcion de recuperacion del correo
    static recoveryPass = async(req,res)=>{ //recibo email
        try {
            const token = req.query.token;
            const {password} = req.body;  // recibo los nuevos datos desdel el formulario
            const data = verifyEmailToken(token); //ahora verifico si es correcto el token
            if(!data){res.send("el enlace no es valido, por favor genera otro")}// verifico que la contraseña no se al misma que la anterior y luego llamo a la funcion para actualizar la contraseña.
            const userUpdt = authServices.newPassService(data, password); // campo a actualizar
            if(userUpdt.message != "Error"){res.send("Cambio de contraseña exitosa")}
            
        } catch (error) {
            //next(error);
            console.log(error)
        }    
    
    };

    static currentAuthController = async(req,res)=>{ //info que contiene el token desactualizado
        const {last_name, first_name, email, cart, role} = req.user;
        res.json({...req.user});
    };
    
    static gitLogAuthController = (req,res)=>{
        res.json("redireccion exitosa")
    };
    
    static gitFailAuthController = (req,res) =>{
        res.redirect("/products")
    };
    
    static logOutAuthController = async(req,res)=>{
        const { email } = req.user;
        const data = {last_connection: new Date()};
        const user = { email: email };
        const conn = authServices.updateProfileUser(user, data)
        res.clearCookie("cookie-token");  //elimino el token del usuario
        res.redirect("/login"); //debo redireccionar a login
    };
}
export {authController};