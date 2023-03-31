import { Router, json, urlencoded } from "express";
import productManagerDb from "../Dao/ManagersDb/productManagerDb.js";
import dataStorage from "../uploader.js"

const groupProducts = new productManagerDb();

const productsRouter = Router();

productsRouter.use(urlencoded({extended: true}));
productsRouter.use(json());

productsRouter.get("/",async(req, res)=>{ //ya esta
    try{
        const { limit } = req.query;
        const productData = await groupProducts.getProduct();

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

productsRouter.get("/:pid", async(req, res)=>{ //ya esta
    try{
        const { pid } = req.params;
        let productById = await groupProducts.getProductById(pid);
        res.send(productById);
    }catch(err){
        res.status(404).send(err);
    }
})

productsRouter.post("/", dataStorage.single("file"), async(req, res)=>{ //ya esta
    let newProduct;
    if(!req.file){
        newProduct = {...req.body, thumbnail: "empty"};
    }else{
        newProduct = {...req.body, thumbnail: req.file.path};
    }
    let createdProduct = await groupProducts.addProduct(newProduct);

    req.io.emit("sendData", createdProduct.data);

    res.send(createdProduct.data);
})

productsRouter.put("/:pid",async(req, res)=>{
    try{
        const { pid } = req.params;
        const newData = req.body;
        let productsUpdated = await groupProducts.updateProduct(pid, newData);
        req.io.emit("sendData", productsUpdated.data);
        res.send(productsUpdated.data, productsUpdated.message);
    }catch(err){
        res.status(404).send(err,"El producto no se pudo actualizar");
    }
})

productsRouter.delete("/:pid", async(req,res)=>{
    try{
        const { pid } = req.params;
        const productDeleted = await groupProducts.deleteProduct(pid);
        
        req.io.emit("sendData", productDeleted.data)
        res.send(productDeleted.mesagge);
    }catch(err){
        res.status(404).send(err);
    }
})

export default productsRouter;