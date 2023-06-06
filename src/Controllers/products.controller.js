import  { productServices } from "../Repository/index.Repository.js"

import { customErrorRepository } from "../Repository/errorService/customError.Repository.js";
import { EError } from "../Enums/EError.js";
import { generateProductErrorInfo } from "../Repository/errorService/errorGenerate.Repository.js"

class productsController{

    static addProdController = async(req, res, next)=>{
        
        try {
                let newData;
            if(!req.file){
                newData = {...req.body, thumbnail: "empty"};
            }else{
                newData = {...req.body, thumbnail: req.file.path};
            }
            const { title, description, price, code, status, category, stock, thumbnail } = newData;

            if(!title || !description || !price || !code || !status || !category || !stock || !thumbnail){

                customErrorRepository.createError({ // genera bien el error
                    name: "Error al crear el producto",
                    cause: generateProductErrorInfo(newData),
                    message: "Error, Faltan algunos campos, o el formato ingresado no es correcto",
                    errorCode: EError.INVALID_TYPES_ERROR
                })
            }

            const createdProduct = await productServices.addProdService(newData);
            req.io.emit("sendData", createdProduct);
            res.send(createdProduct);
        } catch (error) {
            next(error);
        }
        
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
            
            const productData = await productServices.getProdService(query, page, limit, sort );
            req.io.emit("sendData", productData.payload);
            res.redirect("/products")
            //res.json(productData.payload);
        }catch(err){
            res.status(401).send(err);
        }
    };

    static getProdByIdController = async(req, res)=>{
        try{
            const { pid } = req.params;
            let productById = await productServices.getByIdProdService(pid);
            res.send(productById.payload);
        }catch(err){
            res.status(404).send(err);
        }
    };
    
    static updateProdController = async(req, res)=>{
        try{
            const { pid } = req.params;
            const newData = req.body;
            const productsUpdated = await productServices.updateProdService(pid, newData);
            
            req.io.emit("sendDataCart", productsUpdated.payload);
            res.send(productsUpdated.message);
        }catch(err){
            res.status(404).send(err,"El producto no se pudo actualizar");
        }
    };
    
    static deleteProdController = async(req,res)=>{
        try{
            const { pid } = req.params;
            const productDeleted = await productServices.deleteProdService(pid);
            req.io.emit("sendData", productDeleted.payload);
            res.send(productDeleted.message);
        }catch(err){
            res.status(404).send(err);
        }
    };
    
}
export {productsController};