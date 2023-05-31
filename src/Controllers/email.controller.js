import { transporter } from "nodemailer";


 
class emailController{
    static sendMail = ()=>{
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            auth:{
                user:adminEmail,
                pass:adminPass
            },
            secure:false,
            tls:{
                rejectUnauthorized:false
            }
        });

    }
    
    

}
