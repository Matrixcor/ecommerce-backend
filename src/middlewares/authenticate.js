import passport from "passport";

const authenticate = (strategy)=>{
    const passportAuthenticate = async(req,res,next)=>{
        passport.authenticate(strategy, {sessions: false}, (err,user,info)=>{ 
            if(err) return next(err);
            if(!user) return res.status(401).send({error: info.toString()});
            req.user = user;
            next();  
        })(req,res);
    };
    return passportAuthenticate;
};

export default authenticate;