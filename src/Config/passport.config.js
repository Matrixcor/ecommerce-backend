import passport from "passport";
import  jwt from "passport-jwt";
import GithubStrategy from "passport-github2";
import { createHash , isValidPassword, cookieExtractor } from "../utils.js";
import { userModel } from "../Dao/Mongo/Models/user.Model.js";
import { enviromentOptions } from "./enviroment.options.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWt = jwt.ExtractJwt;

const startPassport = ()=>{
    passport.use("jwt",
        new JWTStrategy( //aqui extrae la cookie
            {
                jwtFromRequest: ExtractJWt.fromExtractors([cookieExtractor]),
                secretOrKey: "key-secret",
            },
            async (jwt_Payload, done)=>{
                try{
                    return done(null, jwt_Payload)
                }catch(err){
                    return done(err)
                }
            }
        )
    );
    


    /*
    passport.use("registerStrategy", new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true
        }, //segundo argumento callback
        async(req, username, password, done)=>{
            try{
                const user = await userModel.findOne({ email: username});
                if(user){
                    // si existe el usuario no lo crea
                    return done(null, false);
                }
                //si no existe lo crea
                const newUser = {
                    email: username,
                    password: createHash(password)
                };
                const createUser = await userModel.create(newUser);
                // enviamos la respuesta
                return done(null, createUser);
            }catch(error){
                return done(error);
            }
        }  
    ));
    passport.use("loginStrategy", new LocalStrategy(
        {
            usernameField: "email"
        },
        async(username,password, done)=>{
            try{
                const loginUser = await userModel.findOne({ email: username});
                if(!loginUser){
                    return done(null, false)
                }
                if(isValidPassword(loginUser, password)){
                    return done(null, loginUser)
                }else{
                    return done(null, false)
                }
            }catch(error){
                return done(error)
            }
        }
    ))
        */
    const clientID = enviromentOptions.git.git_clientID;
    const clientSecret = enviromentOptions.git.git_clientSecret;
    const callbackURL = enviromentOptions.git.git_callbackURL;
    
    passport.use("github", 
        new GithubStrategy(
            { //credenciales
                clientID,
                clientSecret,
                callbackURL
            },
            async(accesToken, refreshToken, profile, done) =>{
                try{
                    console.log("profile: ", profile )
                    
                    const user = await userModel.findOne({ email: profile.username });
                    if(!user){
                        const newUser = {
                            first_name: profile._json.name,
                            last_name: null ,
                            age: null,
                            email: profile._json.username,
                        };
                        const createdUser = await userModel.create(newUser);
                        return done(null, createdUser);
                        
                    }else{
                        return done(null, user);
                    }
                    
                }catch(err){
                    return done(err);
                }
            }
        )
    )
    
}
export default startPassport;
