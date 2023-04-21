import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import { createHash , isValidPassword } from "../utils.js";
import { userModel } from "../Dao/Models/user.Model.js";

const startPassport = ()=>{
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

    passport.use("github", new GithubStrategy(
        { //credenciales
            clientID: "",
            clientSecret: "",
            callbackURL: "http://localhost:8080/api/sessions/github-callback"
        },
        async(accesToken, refreshToken, profile, done) =>{
            try{
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
    ))

    passport.serializeUser((user, done)=>{
        done(null, user._id); // puedo guardar en la session datos como email, o tipo de usuario?
    });
    passport.deserializeUser(async(id, done)=>{
        const user = await userModel.findById(id);
        return done(null, user)
    });
}
export default startPassport;
