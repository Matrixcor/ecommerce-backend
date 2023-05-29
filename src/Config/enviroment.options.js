import dotenv from "dotenv";

dotenv.config();

export const enviromentOptions ={
    server:{
        port: process.env.PORT,
        host: process.env.HOST,
        persistence: process.env.PERSISTENCE
    },
    mongoDB:{
        url: process.env.MONGO_URL
    },
    devEnviroment:{
        node_env: process.env.NODE_ENV,
    },
    git:{
        git_clientID: process.env.GIT_CLIENTID,
        git_clientSecret: process.env.GIT_CLIENTSECRET,
        git_callbackURL: process.env.GIT_CALLBACKURL
    },
    jwt:{
        private_key: process.env.PRIVATE_KEY
    },
    superAdmin:{
        admin_email: process.env.ADMIN_EMAIL,
        admin_password: process.env.ADMIN_PASSWORD
    },
    email:{
        mail_host: process.env.EMAIL_HOST,
        mail_port: process.env.EMAIL_PORT
    },
    twilio:{
        twilio_Id: process.env.TWILIO_ID , 
        twilio_token: process.env.TWILIO_TOKEN,
        twilio_number: process.env.TWILIO_PHONE
    }
};