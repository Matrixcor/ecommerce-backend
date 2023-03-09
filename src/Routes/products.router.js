import { Router, json, urlencoded } from "express";
import productManager from "../Managers/productManager.js";
import dataStorage from "../uploader.js"

const groupProducts = new productManager("./././products.json");

const productsRouter = Router();

productsRouter.use(urlencoded({extended: true}));
productsRouter.use(json());

productsRouter.get("/",async(req, res)=>{ // trae los productos
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

productsRouter.get("/:pid", async(req, res)=>{
    try{
        const { pid } = req.params;
        let productById = await groupProducts.getProductById(parseInt(pid));
        res.send(productById);
    }catch(err){
        res.status(404).send(err);
    }
})

productsRouter.post("/", dataStorage.single("file"), async(req, res)=>{
    let newProduct;
    if(!req.file){
        newProduct = {...req.body, thumbnail: []};
    }else{
        newProduct = {...req.body, thumbnail: req.file.path};
    }
    const createdProduct = await groupProducts.addProduct(newProduct);
    req.io.emit("sendData", createdProduct.data)
    res.send(createdProduct.mesagge);
})

productsRouter.put("/:pid",async(req, res)=>{
    try{
        const { pid } = req.params;
        const newData = req.body;
        let productsUpdated = await groupProducts.updateProduct(parseInt(pid), newData);
        res.send(productsUpdated.message);
    }catch(err){
        res.status(404).send(err,"El producto no se pudo actualizar");
    }    
})

productsRouter.delete("/:pid", async(req,res)=>{
    try{
        const { pid } = req.params;
        const productDeleted = await groupProducts.deleteProduct(parseInt(pid));
        req.io.emit("sendData", productDeleted.data)
        res.send(productDeleted.mesagge);
    }catch(err){
        res.status(404).send(err);
    }
})

export default productsRouter;