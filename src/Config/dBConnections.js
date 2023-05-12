import mongoose from "mongoose";
import { enviromentOptions } from "./enviroment.options.js";

try{
    await mongoose.connect(enviromentOptions.mongoDB.url);
    console.log("Connected to DB!");
}catch(error){
    console.log(`error: ${error}, unnable to connect dB!`);
}