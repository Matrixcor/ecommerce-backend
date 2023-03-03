
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
    // listo un solo producto
    try{
        const { pid } = req.params;
        let productById = await groupProducts.getProductById(parseInt(pid));
        res.send(productById);
    }catch(err){
        res.status(404).send(err);
    }
})

productsRouter.post("/", dataStorage.single("file"), async(req, res)=>{
    //falla la carga de la ruta de la imagen, aparece doble slash.
    if(!req.file){
        console.log("path vacio")
    }else{
        let newUser = {...req.body, thumbnail: req.file.path};
        let createdUser = await groupProducts.addProduct(newUser);
        res.send(createdUser);
    }
})

productsRouter.put("/:id",async(req, res)=>{
//debe actualizar el producto
    try{
        const { pid } = req.params;
        const newData = req.body;
        let productsUpdated = await groupProducts.updateProduct(parseInt(pid), newData);
        res.send(productsUpdated);
    }catch(err){
        res.status(404).send(err);
    }    
})

productsRouter.delete("/:id",async(req,res)=>{
//debe eliminar el producto
    try{
        const { pid } = req.params;
        let productDeleted = await groupProducts.deleteProduct(parseInt(pid));
        res.send(productDeleted);
    }catch(err){
        res.status(404).send(err);
    }
})

export default productsRouter;