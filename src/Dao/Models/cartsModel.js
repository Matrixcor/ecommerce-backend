import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                idProduct: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: { type: Number},
            },
        ],
        required: true,
    }
});

const cartsModel = mongoose.model("carts", cartSchema);

export default cartsModel;