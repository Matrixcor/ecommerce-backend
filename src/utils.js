import { enviromentOptions } from "./Config/enviroment.options.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";

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

const checkFieldProfile = (body)=>{
    const { first_name, last_name, age, email, password } = body;
    if(!first_name || !last_name || !age || !email || !password){
        return false;
    }else{
        return true;
    }
};
const checkFieldProduct = (body)=>{
    const { title, description, price, code, status, category, stock, thumbnail } = body;
    if(!title || !description || !price || !code || !status || !category || !stock || !thumbnail){
        return false;
    }else{
        return true;
    }
};
const multerProfileFilter = (req, file, cb)=>{
    const isvalid = checkFieldProfile(req.body);
    if(!isvalid){
        cb(null, false);
    }else{
        cb(null, true);
    }
};

const profileStorage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, path.join(__dirname,'/Files/Users/Images'))
    },
    filename: function(req, file, cb){
        cb(null, `${req.body.email}-perfil-${file.originalname}`);
    }
});
export const profileUploader = multer({storage: profileStorage, fileFilter: multerProfileFilter});

const productStorage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, path.join(__dirname,"/Files/Products/Images"))
    },
    filename: function(req, file, cb){
        cb(null, `${req.body.email}-prodImg-${file.originalname}`);
    }
});
export const productUploader = multer({storage: productStorage});

const documentStorage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, path.join(__dirname,"/Files/Users/Documents"))
    },
    filename: function(req, file, cb){
        cb(null, `${req.user.email}-document-${file.originalname}`);
    }
});
export const documentsUploader = multer({storage: documentStorage});

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync())
};

export const isValidPassword = (user, password)=>{
    return bcrypt.compareSync(password, user.password)
};

const key = enviromentOptions.jwt.private_key;
export const createToken = (user)=>{
    const token = jwt.sign(user, key, {
        expiresIn: "24h"
    });
    return token;
};

export const createEmailToken = (email, expireTime)=>{
    const emailToken = jwt.sign({email}, enviromentOptions.emailToken.email_token, { // averiguar que es el options.gmail.emailtoken, parece que es de config
        expiresIn: expireTime
    });
    return emailToken;
};

export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token, enviromentOptions.emailToken.email_token);
        return info.email
    } catch (error) {
        return null
    }
  
}
/*
export const cookieExtractor = (req) =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies["cookie-token"];
    }
    return token;
};
*/
export const cookieExtractor = (req) =>{ //esta funcion extrae el token cuando se utiliza SWAGGER o los test-
    let token = null;
    if(req && req.headers["authorization"]){
        const authHeader = req.headers["authorization"]
        token = authHeader.split(" ")[1]
    }
    if(req && req.cookies["cookie-token"]){
        token = req.cookies["cookie-token"];
    }
    
    return token;
};
// mockups for testing

export const generateProducts = async()=>{
    const {commerce, image, database, string, datatype, person, internet } = faker;
    return {
        _id: database.mongodbObjectId(),
        title: commerce.product(), 
        description: commerce.productDescription(), 
        price: parseInt(commerce.price()),
        code: string.alphanumeric(4), 
        status: datatype.boolean(), 
        category: commerce.department(), 
        stock: parseInt(string.numeric(2)), 
        thumbnail: image.urlLoremFlickr({category: 'technics'}),
    }
};

export const generateUsers = async()=>{
    return{
        first_name: person.firstName(sex),
        last_name: person.lastName(sex),
        email: internet.email(),
        age: parseInt(string.numeric(2)),
        password: internet.password(),
        cart:{ 
            type: String,
        },
        role:{
            type: String,
        }
    }
}