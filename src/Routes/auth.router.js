import { Router, json, urlencoded } from "express";
import authManagerDb from "../Dao/ManagersDb/authManagerDb.js";

const authGroup = new authManagerDb();
const authRouter = Router();
//registro de usuario
authRouter.post("/register", async (req,res)=>{
    try{
        const { email , password } = req.body;
        const userTocompare = await authGroup.registerNewUser( email, password ); //registra al usuario en la DB
        console.log(userTocompare)
        
        if(userTocompare.userAdmin){
            req.session.user = email;
            req.session.rol = "isAdmin";
        }else{
            req.session.user = email;
            req.session.rol = "user";
        }
        userTocompare.redirect ? res.redirect("/profile") : res.send(userTocompare.message)
    }catch(err){
        res.status(404).send(err);
    }
})
//login de usuario
authRouter.post("/login", async(req, res)=>{
    try{
        const { email , password } = req.body;
        const login = await authGroup.loginUser(email , password);
        if(login.userAdmin){
            req.session.user = email;
            req.session.rol = "isAdmin";
        }else{
            req.session.user = email;
            req.session.rol = "user";
        }
        login.redirect ? res.redirect("/products") : res.send(login.message)
    }catch(err){
        res.status(404).send(err);
    }
})

//logOut de usuario

authRouter.get("/logout", async(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send("LogOut succes!");
        };
        res.redirect("/login");
    });
})


export default authRouter;