
// chequeo de roles para acceder y modificar cosas
export const checkRole = (role)=>{ // role
    return async(req,res,next)=>{
        if(!req.user){
            return res.json({status:"Error", message:"Necesitas estar autenticado"})
        }
        if(req.user.role != role ){ //role.include(req.user.role)
            return res.json({status:"Error", message:"No estas autorizado"})
        }
        next();
    }
}