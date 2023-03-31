import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    
    products: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: { type: Number},
            },
        ],
        required: true,
    }
    /*
    products: {
        type: Array,
        required: true,
    }
    */
});

const cartsModel = mongoose.model("carts", cartSchema);

export default cartsModel;