import ticketsModel from "../DAOs/models/ticket.model.js";

export default class TicketRepository {
    async create(ticketData) {
        const ticket = new ticketsModel(ticketData);
        return await ticket.save();
    }

    async getById(id) {
        return await ticketsModel.findById(id);
    }
}
