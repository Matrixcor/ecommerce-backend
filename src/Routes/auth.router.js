import { Router, json, urlencoded } from "express";
import passport from "passport";

//const authGroup = new authManagerDb();
const authRouter = Router();

// quite lo de los roles debido a que me surgio la duda sobre como evitar el harcodeo del password para hacer
// la distincion entre user y admins.

//registro de usuario con local strategy

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
