import passport from "passport";
import  jwt from "passport-jwt";
import GithubStrategy from "passport-github2";
import { cookieExtractor } from "../utils.js";
import { userModel } from "../Dao/Mongo/Models/user.Model.js";
import { enviromentOptions } from "./enviroment.options.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWt = jwt.ExtractJwt;

const startPassport = ()=>{
    const key = enviromentOptions.jwt.private_key;
    passport.use("jwt",
        new JWTStrategy( //aqui extrae la cookie
            {
                jwtFromRequest: ExtractJWt.fromExtractors([cookieExtractor]),
                secretOrKey: key,
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
