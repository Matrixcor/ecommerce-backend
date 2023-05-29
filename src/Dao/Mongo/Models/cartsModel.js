import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                },
            },
        ],
        required: true,
        default: [],
    }
});

cartSchema.pre("findOne", function(){
    this.populate("products.product");
});

cartSchema.plugin(mongoosePaginate);

const cartsModel = mongoose.model("carts", cartSchema);

export default cartsModel;