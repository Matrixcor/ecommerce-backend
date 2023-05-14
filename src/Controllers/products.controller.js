import  { productService } from "../Services/productService.js"
import { query } from "express";

class productsController{

    static addProdController = async(req, res)=>{
        let newProduct;
        if(!req.file){
            newProduct = {...req.body, thumbnail: "empty"};
        }else{
            newProduct = {...req.body, thumbnail: req.file.path};
        }
        const createdProduct = await productService.addProdService(newProduct);
        req.io.emit("sendData", createdProduct);
        res.send(createdProduct);
    };

    static getProdController = async(req, res)=>{
        try{
            // los posibles params a recibir para hacer la busqueda
            const { title } = req.query;
            const { price } = req.query ;
            const { code } = req.query;
            // filtros
            const { page } = req.query;
            const { limit } = req.query;
            const { sort } = req.query;
            const query =  { title, price, code };

            const productData = await productService.getProdService(query, page, limit, sort );
            req.io.emit("sendData", productData.payload);
            res.send(productData.payload);
        }catch(err){
            res.status(401).send(err);
        }
    };

    static getProdByIdController = async(req, res)=>{
        try{
            const { pid } = req.params;
            let productById = await productService.getByIdProdService(pid);
            res.send(productById.payload);
        }catch(err){
            res.status(404).send(err);
        }
    };
    
    static updateProdController = async(req, res)=>{
        try{
            const { pid } = req.params;
            const newData = req.body;
            const productsUpdated = await productService.updateProdService(pid, newData);
            
            req.io.emit("sendData", productsUpdated.payload);
            res.send(productsUpdated.message);
        }catch(err){
            res.status(404).send(err,"El producto no se pudo actualizar");
        }
    };
    
    static deleteProdController = async(req,res)=>{
        try{
            const { pid } = req.params;
            const productDeleted = await productService.deleteProdService(pid);
            req.io.emit("sendData", productDeleted.payload);
            res.send(productDeleted.message);
        }catch(err){
            res.status(404).send(err);
        }
    };
    
}
export {productsController};