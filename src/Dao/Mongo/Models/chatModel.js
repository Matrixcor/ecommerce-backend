import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true
    }
});

const chatModel = mongoose.model("message", messageSchema);

export default chatModel; 