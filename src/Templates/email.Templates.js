
export const emailTemplateLogin = `
    <div>
        <h1>Bienvenido!!</h1>
        <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
        <p>Ya puedes empezar a usar nuestros servicios</p>
        <a href="https://www.google.com/">Explorar</a>
    </div>
`;

export const emailTemplateTickets = async(prodTicket)=>{
    const{ code, purchase_datetime, amount, purchaser}= prodTicket;
    const emailTemplate = `
        <div>
            <h1>Gracias Por Su Compra!!</h1>
            <ul>
                <li> <b> Nº de Ticket:</b>  ${code}</li>
                <li> <b> Fecha de Compra:</b>  ${purchase_datetime}</li>
                <li> <b>Monto total de la Factura:</b>  ${amount}</li>
                <li> <b>Titular de la factura:</b> ${purchaser}</li>
            </ul>
            <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
            <p>Gracias por confiar en nuestros servicios</p>
            <a href="https://www.google.com/">Explorar</a>
        </div>
    `;
    return emailTemplate
}