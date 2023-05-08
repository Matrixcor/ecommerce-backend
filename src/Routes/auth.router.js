import { Router, json, urlencoded } from "express";
import passport from "passport";
import { userModel } from "../Dao/Models/user.Model.js";
import { createHash, isValidPassword, createToken } from "../utils.js";
import authenticate from "../middlewares/authenticate.js";

//const authGroup = new authManagerDb();
const authRouter = Router();

authRouter.post("/register", async(req,res)=>{ //revisar
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
});

authRouter.post("/login", async(req,res)=>{
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
    }else{
        return res.status(409).json("Invalid Credentials");
    }
});

authRouter.get("/current", authenticate("jwt"),(req,res)=>{
    const {last_name, first_name, email, role} = req.user;
    res.json({last_name, first_name, email, role});
    //deboo redireccionar a profile o a products
})


/*  -autenticacion con github strategy.
    -la idea es modificar la estrategia para utilizar JWT y asi evitar utilizar session.
    -tengo que modificar el middleware authenticate.
*/

authRouter.get("/github", passport.authenticate("github", 
    { scope: ["user: email"]}),
    (req,res)=>{
        res.json("redireccion exitosa")
    }
);

authRouter.get("/github-callback", authenticate("github", { failureRedirect: "/api/sessions/Register-Failure"}),
    (req,res) =>{
        console.log("redireccion fallida")
        res.redirect("/products")
    }
);

//logOut de usuario

authRouter.get("/logout", async(req,res)=>{
    //elimino el token del usuario
    res.clearCookie("cookie-token").json("Delete succes");
});

export default authRouter;










//registro de usuario con local strategy

/*
authRouter.post("/register", passport.authenticate( "registerStrategy", {
    failureRedirect: "/api/sessions/Register-Failure"
}), (req,res)=>{
    res.redirect("/products")
});
authRouter.get("/api/sessions/Register-Failure", (req,res)=>{ // ruta en caso de que falle el registro
    res.send("No fue posible registra el usuario")
})

//login de usuario con local strategy

authRouter.post("/login", passport.authenticate( "loginStrategy", {
    failureRedirect: "/api/sessions/Login-Failure"
}), async(req,res)=>{

    if(!req.user){
        return res.status(401).send({ error: "credential invalid"})
    }
    const {_id, email} = req.user;
    req.session.user = {_id, email};
    res.redirect("/products")
});
authRouter.get("/Login-Failure", (req,res)=>{ // ruta en caso de que falle el registro
    res.send({error:"No se puede loggear el usuario"})
})

authRouter.get("/logout", async(req,res)=>{
    
    req.logOut((err)=>{
        if(err){
            return res.send("No se pudo cerrar la sesion")
        }else{
            // deberia destruir la cookie
            req.session.destroy( err =>{
                if(err){
                    return res.status(500).res.clearCookie("cookie-token").json("Delete succes");
                }
                res.redirect("/login");
            })
            
        }
    });
    
});
*/