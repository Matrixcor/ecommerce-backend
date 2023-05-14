import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { enviromentOptions } from "./Config/enviroment.options.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export {__dirname};

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

const key = enviromentOptions.jwt.private_key;
export const createToken = (user)=>{
    const token = jwt.sign(user, key, {
        expiresIn: "24h"
    });
    return token;
};

export const cookieExtractor = (req) =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies["cookie-token"];
    }
    return token;
};