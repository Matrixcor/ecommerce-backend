import dotenv from "dotenv";

dotenv.config();

export const enviromentOptions ={
    fileSystem:{
        usersFileName: "users.json",
        productsFileName:"products.json"
    },
    mongoDB:{
        url: process.env.MONGO_URL
    },
    server:{
        port: process.env.PORT,
        host: process.env.HOST
    },
    devEnviroment:{
        node_env: process.env.NODE_ENV,
        private_key: process.env.PRIVATE_KEY
    },
    git:{
        git_clientID: process.env.GIT_CLIENTID,
        git_clientSecret: process.env.GIT_CLIENTSECRET,
        git_callbackURL: process.env.GIT_CALLBACKURL
    }
};