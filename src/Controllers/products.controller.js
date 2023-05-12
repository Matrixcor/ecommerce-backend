import  { productService } from "../Services/productService.js"

import { query } from "express";
import {dataStorage} from "../utils.js"

//const groupProducts = new productManagerDb();

class productsController{

    static addProdController = async(req, res)=>{
        let newProduct;
        if(!req.file){
            newProduct = {...req.body, thumbnail: "empty"};
        }else{
            newProduct = {...req.body, thumbnail: req.file.path};
        }
        let createdProduct = await productService.addProdService(newProduct);
        // socket 
        if(createdProduct.status == "success") req.io.emit("sendData", createdProduct.payload);
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
            req.io.emit("sendSearchData", productData.payload);
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
            let productsUpdated = await productService.updateProdService(pid, newData);
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

            req.io.emit("sendData", productDeleted.payload)
            res.send(productDeleted.message);
        }catch(err){
            res.status(404).send(err);
        }
    };
    
}

export {productsController};

/*
export const getProdController = async(req, res)=>{
    try{
        // los posibles params a recibir para hacer la busqueda
        const { title } = req.query;
        const { price } = req.query ;
        const { code } = req.query;
        
        // filtros
        const { page } = req.query;
        const { limit } = req.query;
        const { sort } = req.query;

        const query =  { title, price, code } ;
        
        const productData = await groupProducts.getProduct( query, page, limit, sort );
        req.io.emit("sendSearchData", productData.payload);
        res.send(productData.payload);
        
    }catch(err){
        res.status(401).send(err);
    }
};

export const getProdIdController = async(req, res)=>{
    try{
        const { pid } = req.params;
        let productById = await groupProducts.getProductById(pid);
        res.send(productById);
    }catch(err){
        res.status(404).send(err);
    }
};

export const addProdController = async(req, res)=>{
    dataStorage.single("file");
    let newProduct;
    if(!req.file){
        newProduct = {...req.body, thumbnail: "empty"};
    }else{
        newProduct = {...req.body, thumbnail: req.file.path};
    }
    let createdProduct = await groupProducts.addProduct(newProduct);
    // socket 
    req.io.emit("sendData", createdProduct.data);
    res.send(createdProduct.data);
};

export const updateProdController = async(req, res)=>{
    try{
        const { pid } = req.params;
        const newData = req.body;
        let productsUpdated = await groupProducts.updateProduct(pid, newData);
        req.io.emit("sendData", productsUpdated.data);
        res.send(productsUpdated.message);
    }catch(err){
        res.status(404).send(err,"El producto no se pudo actualizar");
    }
};

export const deleteProdController = async(req,res)=>{
    try{
        const { pid } = req.params;
        const productDeleted = await groupProducts.deleteProduct(pid);
        req.io.emit("sendData", productDeleted.data)
        res.send(productDeleted.mesagge);
    }catch(err){
        res.status(404).send(err);
    }
};
*/