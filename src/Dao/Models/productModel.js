import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String, 
    description: String, 
    price: Number, 
    code: String, 
    status: Boolean, 
    category: String, 
    stock: Number, 
    thumbnail: String,
});

const productModel = mongoose.model("products", productSchema);

export default productModel;
