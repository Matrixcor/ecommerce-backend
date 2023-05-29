
// chequeo de roles para acceder y modificar cosas
const checkRole = (role)=>{
    return(req,res,next)=>{
    //console.log(req)
        if(!req.user){
            return res.json({status:" error", message:" necesitas estar autenticado"})
        }
        if(role.include(req.user.role)){
            return res.json({status:"error", message:"no estas autorizado"})
        }
        next();
    }
}
export default checkRole;