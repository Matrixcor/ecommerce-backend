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
    },
    avatar:{
        type: String,
        default: " "
    },
    documents:{
        type: [
            {
                name: {
                    type: String, 
                    require: true
                },
                reference: {
                    type: String,
                    require: true
                },
            },
        ],
        default: [],
    },
    status:{
        type: String,
        require: true,
        enums: ["incompleto","pendiente","completo"],
        default: "pendiente"
    },
    last_connection:{
        type: Date,
        default: null
    }
});

export  const userModel = mongoose.model(userCollection , userSchema);