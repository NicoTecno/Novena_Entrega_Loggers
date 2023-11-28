export default class TicketDTO {
    constructor(userEmail, amount, items) { 
        this.userEmail = userEmail;
        this.amount = amount;
        this.items = items.map(item => ({
            product: item.productId,
            quantity: item.quantity
        }));
    }
}
