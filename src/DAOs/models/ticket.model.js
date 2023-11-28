import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: function () {
            return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
        }
    },

    purchase_datetime: {
        type: Date,
        default: Date.now
    },

    purchaser: {
        type: String,
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number
        },
    }],

    amount: {
        type: Number,
        required: true
    },
},
    {
        timestamps: true,
    });

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

export default ticketsModel;
