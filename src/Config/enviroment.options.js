import dotenv from "dotenv";

dotenv.config();

export const enviromentOptions ={
    server:{
        port: process.env.PORT,
        host: process.env.HOST,
        persistence: process.env.PERSISTENCE
    },
    mongoDB:{
        url: process.env.MONGO_URL,
        url_test: process.env.MONGO_TEST_URL,
        url_production: process.env.MONGO_PRODUCTION_URL
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
    emailService:{
        mail_host: process.env.EMAIL_HOST,
        mail_port: process.env.EMAIL_PORT,
        mail_Service_User: process.env.ADMIN_EMAIL_MAILSERVICE,
        mail_Service_Pass: process.env.ADMIN_PASS_MAILSERVICE
    },
    emailToken:{
        email_token: process.env.PRIVATE_EMAIL_KEY
    },
    twilio:{
        twilio_Id: process.env.TWILIO_ID , 
        twilio_token: process.env.TWILIO_TOKEN,
        twilio_number: process.env.TWILIO_PHONE
    }
};