import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;