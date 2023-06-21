import mongoose from "mongoose";

const userCollection = "users";
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email:{ 
        type: String,
        unique: true
    },
    age:{
        type: Number,
        require: true
    },
    password:{ 
        type: String,
        require: true
    },
    cart:{ 
        type: String,
        require: true
    },
    role:{
        type: String,
        require: true,
        option:["premium","superadmin","admin","user"],
    }
});

export  const userModel = mongoose.model(userCollection , userSchema);