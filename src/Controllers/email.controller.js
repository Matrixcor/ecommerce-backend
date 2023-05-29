

const emailTemplate = `<div>
        <h1>Bienvenido!!</h1>
        <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
        <p>Ya puedes empezar a usar nuestros servicios</p>
        <a href="https://www.google.com/">Explorar</a>
</div>`;
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
