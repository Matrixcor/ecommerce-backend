import mongoose from "mongoose";
import { enviromentOptions } from "./enviroment.options.js";

const connDatabase = async()=>{
    try{
        let enviroment; 
        switch(enviromentOptions.devEnviroment.node_env){
            case "development":{
                enviroment = enviromentOptions.mongoDB.url;
                break;
            }
            case "test":{
                enviroment = enviromentOptions.mongoDB.url_test;
                break;
            }
            case "production":{
                enviroment = enviromentOptions.mongoDB.url_production;
                break;
            }
        };
        await mongoose.connect(enviroment);
        console.log(`Connected to ${enviromentOptions.devEnviroment.node_env} DB!`);
    }catch(error){
        console.log(`error: ${error}, unnable to connect dB!`);
    };
};
export default connDatabase;