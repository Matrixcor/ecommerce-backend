import dotenv from "dotenv";
dotenv.config();

export default {
    node_env: process.env.NODE_ENV,
    host: process.env.HOST,
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    private_key: process.env.PRIVATE_KEY,
    git_clientID: process.env.GIT_CLIENTID,
    git_clientSecret: process.env.GIT_CLIENTSECRET,
    git_callbackURL: process.env.GIT_CALLBACKURL
};
