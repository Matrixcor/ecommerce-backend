import { authServices } from "../Services/auth.Services.js";

class authController{

    static registerAuthController = async(req,res)=>{
        const { first_name, last_name, email, age, password, cart, role } = req.body;
        const userCreated = await authServices.registerAuthService(first_name, last_name, email, age, password, cart, role);
        //generamos el token    
        console.log(userCreated)
        if( userCreated.status !== "Error"){
            res.cookie("cookie-token", userCreated.payload, {maxAge: 60*60*1000, httpOnly: true});
            res.redirect("/products");
        }else{
            res.status(409).json("Invalid Credentials");
        }
        
    };
    
    static loginAuthController = async(req,res)=>{
        const data = req.body;
        const logRes = await authServices.loginAuthService(data);
    
        if(logRes.status !== "Error"){
            res.cookie("cookie-token", logRes.payload, {maxAge: 60*60*1000, httpOnly: true});
        }else{
            res.status(409).json("Invalid Credentials");
        }
        res.redirect("/products");   
    };
    
    static currentAuthController = async(req,res)=>{
        const {last_name, first_name, email, role} = req.user;    
        res.json({last_name, first_name, email, role});
    };
    
    static gitLogAuthController =  (req,res)=>{
        res.json("redireccion exitosa")
    };
    
    static gitFailAuthController = (req,res) =>{
        console.log("redireccion fallida")
        res.redirect("/products")
    };
    
    static logOutAuthController = async(req,res)=>{
        //elimino el token del usuario
        res.clearCookie("cookie-token")
        //debo redireccionar a login
        res.redirect("/login")
    };

}
export {authController};



/*
export const registerAuthController = async(req,res)=>{
    const { first_name, last_name, email, age, password, cart, role } = req.body;
    const userCreated = await authServices.registerAuthService(first_name, last_name, email, age, password, cart, role);
    //generamos el token    
    if( userCreated.status !== "Error"){
        res.cookie("cookie-token", userCreated.payload, {maxAge: 60*60*1000, httpOnly: true});
    }else{
        res.status(409).json("Invalid Credentials");
    }
    res.redirect("/products");
};

export const loginAuthController = async(req,res)=>{
    const data = req.body;
    const logRes = await authServices.loginAuthService(data);

    if(logRes.status !== "Error"){
        res.cookie("cookie-token", logRes.payload, {maxAge: 60*60*1000, httpOnly: true});
    }else{
        res.status(409).json("Invalid Credentials");
    }
    res.redirect("/products");   
};

export const currentAuthController = async(req,res)=>{
    const {last_name, first_name, email, role} = req.user;    
    res.json({last_name, first_name, email, role});
};

export const gitLogAuthController =  (req,res)=>{
    res.json("redireccion exitosa")
};

export const gitFailAuthController = (req,res) =>{
    console.log("redireccion fallida")
    res.redirect("/products")
};

export const logOutAuthController = async(req,res)=>{
    //elimino el token del usuario
    res.clearCookie("cookie-token").json("Delete succes");
    //debo redireccionar a login
    res.redirect("/login")
};
*/