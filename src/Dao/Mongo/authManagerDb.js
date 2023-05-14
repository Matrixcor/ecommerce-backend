import { Router, json, urlencoded , query } from "express";
import { createHash , isValidPassword } from "../../utils.js";
import { userModel} from "./Models/user.Model.js"

class authManagerDb {

    static userCreate = async(newUser)=>{
        const createUser = await userModel.create(newUser)
        return createUser;
    }
    static getUser = async(email)=>{
        const result = await userModel.findOne({ email: email });
        return result;
    }
}

export {authManagerDb};