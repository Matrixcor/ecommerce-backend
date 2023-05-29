import ticketModel from "../Dao/Mongo/Models/tickets.Model.js";
import { cartServices } from "./index.Repository.js";
import { v4 as uuidv4 } from 'uuid';

class ticketRepository{
    constructor(dao){
        this.dao = dao;
    };

    async newTicketService(cid, email){
        try {
            
            let totalAmount =0;
            const cart = await cartServices.getProdCartService(cid); // lo que hay en el carrito
            const carts = cart.products;
            const arraycheck = await cartServices.updateCartService(carts, cid)
            const ticketAmount = arraycheck.payload;
            ticketAmount.forEach((p)=>{
                totalAmount = totalAmount + p.amount;
            })
            
            const newTicket = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: email, // podria cambiarlo por el email
            }
            const ticketToPush = await ticketModel.create(newTicket);
            return ticketToPush; 
        } catch (error){
            return { status:"Error", message:"No se pudo crear el ticket"}
        }
       
    }
}
export { ticketRepository };