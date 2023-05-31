import { enviromentOptions } from "./enviroment.options.js"
import nodemailer from "nodemailer"

const adminUser = enviromentOptions.emailService.mail_Service_User;
const adminPass = enviromentOptions.emailService.mail_Service_Pass;

export const transporter = nodemailer.createTransport({
    host: enviromentOptions.emailService.mail_host,
    port: enviromentOptions.emailService.mail_port,
    auth:{
        user: adminUser,
        pass: adminPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});