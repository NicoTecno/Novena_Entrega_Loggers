import TicketRepository from '../repositories/tickets.repository.js';
import TicketDTO from "../DTOs/TicketsDto.js";

export class TicketService {
    constructor() {
        this.repository = new TicketRepository();
    }

    async createTicket(ticketDto) {
        const ticketData = {
            purchaser: ticketDto.userEmail,
            amount: ticketDto.amount,
            items: ticketDto.items,
        };
        return await this.repository.create(ticketData);
    }


    async getById(id) {
        return await this.repository.getById(id);
    }
}

const ticketService = new TicketService();
export default ticketService;
