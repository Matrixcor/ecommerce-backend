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
            const cart = await cartServices.getProdCartService(cid); // trae el carrito de compras
            const carts = cart.products;
            const arrayVerified = await cartServices.updateCartService(carts, cid) // obtengo el carrito con los productos filtrados que pasaron la verificacion de stock
            await cartServices.updateCartAndStockProduct(arrayVerified, cid , carts) // elimina los productos sin stock y actualiza el stock de productos de la DB
            console.log("arreglo del ticket: ", arrayVerified)
           
            arrayVerified.cartChecked.forEach((p)=>{
                totalAmount = totalAmount + p.amount;
            })
            
            const newTicket = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: email,
            }
            const ticketToPush = await ticketModel.create(newTicket);
            return ticketToPush; 
        } catch (error){
            return { status:"Error", message:"No se pudo crear el ticket"}
        }
       
    }
}
export { ticketRepository };