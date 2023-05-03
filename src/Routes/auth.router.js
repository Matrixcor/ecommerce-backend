import { Router, json, urlencoded } from "express";
import passport from "passport";
import { userModel } from "../Dao/Models/user.Model.js";
import { createHash, isValidPassword, createToken, autenthicateToken } from "../utils.js";

//const authGroup = new authManagerDb();
const authRouter = Router();

authRouter.post("/register", async(req,res)=>{
    const { first_name, last_name, email, age, password } = req.body;
    const userExist = await userModel.findOne({ email: email });
    if(userExist) return res.status(409).send("el usuario ya existe");
    //creamos el usuario
    const newUser = {
        first_name, 
        last_name,
        email,
        age,
        password: createHash(password)
    };
    const createUser = await userModel.create(newUser);
    //generamos el token
    const userForToken = { first_name, last_name, email, age}
    const accesToken = createToken({ userForToken });
    //res.send({ staus: "ok", accesToken });
    res.cookie("coder-cookie-token", accesToken, {maxAge: 60*60*1000, httpOnly: true}).send({status: "ok"});
});

authRouter.post("/login", async(req,res)=>{
    const { email, password }= req.body;

    const loginUser = await userModel.findOne({ email: email});
    
    if(!loginUser){
        return res.status(409).send("El usuario ingresado no existe")
    }
    if(isValidPassword(loginUser, password)){
        const user = { email, password }
        const token = createToken(user);
        res.cookie("coder-cookie-token", token, {maxAge: 60*60*1000, httpOnly: true}).send({status: "ok"});
    
    }else{
        return res.status(409).json("Invalid Credentials");
    }
});

authRouter.post("/profile", autenthicateToken,async(req,res)=>{
    res.send("acceso al recurso")
});


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
*/

// autenticacion con github strategy

authRouter.get("/github", passport.authenticate("github", 
    { scope: ["user: email"]})
);

authRouter.get("/github-callback", passport.authenticate("github", { failureRedirect: "/api/sessions/Register-Failure"}),
    (req,res) =>{
        req.session.user = req.user;
        res.redirect("/products")
        // aqui falla el obtener datos para mostrar username en el views router, por como esta estructurado el profile
    }
);

//logOut de usuario

authRouter.get("/logout", async(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return res.send("No se pudo cerrar la sesion")
        }else{
            req.session.destroy( err =>{
                if(err){
                    return res.status(500).send("LogOut succes!");
                }
                res.redirect("/login");
            })
        }
        
    });
})


export default authRouter;
