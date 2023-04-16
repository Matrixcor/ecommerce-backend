import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";


export const createHash= (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(100))
};

export const isValidPassword = (password)=>{
    return bcrypt.compareSync(password, bcrypt.genSaltSync(100))
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;