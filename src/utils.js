import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// para subir archivos a la carpeta public
const storage = multer.diskStorage({
    destination: './public/img',
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const dataStorage = multer({ storage });
export {dataStorage};



export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync())
};

export const isValidPassword = (user, password)=>{
    return bcrypt.compareSync(password, user.password)
};
// implementacion para migrar a JSON WEB TOKEN

const PRIVATE_KEY = "key-secret";

export const createToken = (user)=>{
    const token = jwt.sign(user, PRIVATE_KEY, {
        expiresIn: "24h"
    });
    return token;
};

// middleware para paginas privadas
/*
export const autenthicateToken = (req,res,next)=>{
    
    //llamar al cookie extractor
    
    //const authHeader = req.headers["authorization"]; // cambiar por cookies
    //if(!authHeader){
    //    return res.sendStatus(401)
    //};
    //const token = authHeader.split(" ")[1];
    
    const token = cookieExtractor(req);

    // esto por si necesitamos la data en alguna pagina privada
    jwt.verify(token, PRIVATE_KEY, (err, info)=>{
        if(err) return res.sendStatus(401);
        req.user = info;
        next();
    })
};
*/
export const cookieExtractor = (req) =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies["cookie-token"];
        
    }
    return token;
};

export default __dirname;