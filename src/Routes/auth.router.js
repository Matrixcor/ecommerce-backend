import { Router, json, urlencoded } from "express";
import authManagerDb from "../Dao/ManagersDb/authManagerDb.js";

const authGroup = new authManagerDb();
const authRouter = Router();
//register
authRouter.post("/register", async(req,res)=>{
    try{
        const { email , password } = req.body;
        const userTocompare = await authGroup.registerNewUser( email, password ); //registra al usuario en la DB
        userTocompare ? res.redirect("/profile") : res.send(userTocompare.message) // no logro hacer la redireccion a la seccion profile
        res.send(userTocompare)
    }catch(err){
        res.status(404).send(err);
    }
})
//login
authRouter.post("/login", async(req, res)=>{
    try{
        const { email , password } = req.body;
        const login = await authGroup.loginUser(email , password);
        login ? res.redirect("/profile") : res.send(userTocompare.message) // no logro hacer la redireccion a la seccion profile
    }catch(err){
        res.status(404).send(err);
    }
})

//logOut

authRouter.get("/logout", async()=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send({status: "error", payload: err})
        };
        res.redirect("/login")
        res.send("LogOut succes!")
    })
})


export default authRouter;