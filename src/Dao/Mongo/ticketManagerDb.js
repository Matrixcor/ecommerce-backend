import ticketModel  from "./Models/tickets.Model.js";

class ticketManagerDb{
    async createTicket(){
        try {
            
            //const ticketToPush = await ticketModel.create(ticketData);
            console.log("ticket creado");
            
            return ticketToPush;
        } catch (error) {
            return error;
        }
    }
}
export { ticketManagerDb };