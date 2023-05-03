import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync())
};

export const isValidPassword = (user, password)=>{
    return bcrypt.compareSync(password, user.password)
};


// implementacion para migrar a JSON WEB TOKEN

const PRIVATE_KEY = "key-secret";

export const createToken = (user)=>{
    const token = jwt.sign(user,PRIVATE_KEY, {
        expiresIn: "60s"
    });
    return token;
};

// middleware para paginas privadas
export const autenthicateToken = (req,res,next)=>{
    const authHeader = req.headers["authorization"];
    if(!authHeader){
        return res.sendStatus(401)
    };

    const token = authHeader.split(" ")[1];
    // esto por si necesitamos la data en alguna pagina privada
    jwt.verify(token, PRIVATE_KEY, (err, info)=>{
        if(err) return res.sendStatus(401);
        req.user = info;
        next();
    })
};

export const cookieExtractor = (req) =>{
    const token = null;
    if(req && req.cookies){
        token = req.cookies["coder-cookie-token"];
    }
    return token;
};

export default __dirname;