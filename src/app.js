import  express  from "express";

import productManager from "./productManager.js";

const groupProducts = new productManager("././data.json");
const app = express();

app.get("/products", async(req, res)=>{
    try{
        const { limit } = req.query;
        let productData = await groupProducts.getProduct();
        if(!limit){ 
            res.send(productData);
        }else{
            productData.length = parseInt(limit); 
            res.send(productData);
        }
    }catch(err){
        res.status(401).send(err);
    }  
})

app.get("/products/:pid", async(req , res)=>{
    try{
        const { pid } = req.params;
        let productById = await groupProducts.getProductById(parseInt(pid));
        res.send(productById);
    }catch(err){
        res.status(404).send(err);
    }
})

app.listen("8080", ()=>{
    console.log("Server listening in port 8080");
})