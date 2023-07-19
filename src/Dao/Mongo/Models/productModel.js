import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    owner: String,
    price: Number,
    code: String,
    status: Boolean,
    category: String,
    stock: Number,
    thumbnail:{
        type: String,
        default: "",
    }
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("products", productSchema);

export default productModel;
