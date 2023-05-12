import { userModel } from "../Dao/Mongo/Models/user.Model.js";
import { createHash, isValidPassword, createToken } from "../utils.js";

export const registerAuthController = async(req,res)=>{
    const { first_name, last_name, email, age, password, cart, role } = req.body;
    const userExist = await userModel.findOne({ email: email });
    if(userExist) return res.status(409).send("el usuario ya existe");
    //creamos el usuario
    const newUser = {
        first_name, 
        last_name,
        email,
        age,
        password: createHash(password),
        cart:"",
        role:""
    };
    const createUser = await userModel.create(newUser);
    //generamos el token
    const dataForToken = { first_name, last_name, email, age, role};
    const accesToken = createToken({ dataForToken });
    res.cookie("cookie-token", accesToken, {maxAge: 60*60*1000, httpOnly: true}).send({status: "ok"});
};

export const loginAuthController = async(req,res)=>{
    const { email, password }= req.body;
    const loginUser = await userModel.findOne({ email: email});
    if(!loginUser){
        return res.status(409).json("User don't exist");
    }
    if(isValidPassword(loginUser, password)){
        const { first_name,last_name,role }= loginUser;
        const user = { first_name,last_name,role, email};
        const token = createToken(user);
        
        res.cookie("cookie-token", token, {maxAge: 60*60*1000, httpOnly: true}).send({status: "ok"});
        //debo redireccionar a productos
        //res.redirect("/products");
    }else{
        return res.status(409).json("Invalid Credentials");
    }
};

export const currentAuthController = (req,res)=>{
    const {last_name, first_name, email, role} = req.user;
    res.json({last_name, first_name, email, role});
    //debo redireccionar a profile o a products
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
};