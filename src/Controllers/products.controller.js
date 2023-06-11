import  { productServices } from "../Repository/index.Repository.js"

import { customErrorRepository } from "../Repository/errorService/customError.Repository.js";
import { generateProductErrorInfo } from "../Repository/errorService/errorGenerate.Repository.js"
import { EError } from "../Enums/EError.js";
import { currentLogger } from "../Repository/logger.js";

const logger = currentLogger();

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
                logger.error("Error en addProdController - Datos del producto incompletos");
                customErrorRepository.createError({ // genera bien el error
                    name: "Error al crear el producto",
                    cause: generateProductErrorInfo(newData),
                    message: "Error, Faltan algunos campos, o el formato ingresado no es correcto",
                    errorCode: EError.INVALID_TYPES_ERROR
                })
            };

            const createdProduct = await productServices.addProdService(newData);
            if(createdProduct.status !== "Error"){
                req.io.emit("sendData", createdProduct);
                res.send(createdProduct);
            }else{
                logger.warning("El producto ya existe en la base de datos");
                logger.error("Error en addProdController - Producto existente");
                res.status(409).json(createdProduct.message);
            }
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

            if(productData.status !== "Error"){
                req.io.emit("sendData", productData.payload);
                res.redirect("/products")
                //res.json(productData.payload);
            }else{
                logger.warning("El producto no pudo obtenerse de la base de datos");
                logger.error("Error en getProdController - No se obtuvo el Producto");
                res.status(409).json(createdProduct.message);
            } 
        }catch(error){
            res.status(401).send(error);
        }
    };

    static getProdByIdController = async(req, res)=>{
        try{
            const { pid } = req.params;
            if(!pid){
                logger.warning("Falta ingresar el valor Id del producto");
                logger.error("Error en getProdByIdController - no se ingreso el valor id del producto");
                res.send("Ingrese un valor ID");
            }
            let productById = await productServices.getByIdProdService(pid);
            res.send(productById.payload);
        }catch(error){
            res.status(404).send(error);
        }
    };
    
    static updateProdController = async(req, res)=>{
        try{
            const { pid } = req.params;
            const newData = req.body;
            if(!pid){
                logger.warning("Falta ingresar el valor Id del producto");
                logger.error("Error en updateProdController - no se ingreso el valor id del producto");
                res.send("Ingrese un valor ID");
            }
            const productsUpdated = await productServices.updateProdService(pid, newData);
            
            req.io.emit("sendDataCart", productsUpdated.payload);
            res.send(productsUpdated.message);
        }catch(error){
            res.status(404).send(error,"El producto no se pudo actualizar");
        }
    };
    
    static deleteProdController = async(req,res)=>{
        try{
            const { pid } = req.params;
            if(!pid){
                logger.warning("Falta ingresar el valor Id del producto");
                logger.error("Error en deleteProdController - no se ingreso el valor id del producto");
                res.send("Ingrese un valor ID");
            }
            const productDeleted = await productServices.deleteProdService(pid);
            req.io.emit("sendData", productDeleted.payload);
            res.send(productDeleted.message);
        }catch(error){
            res.status(404).send(error);
        }
    };
}
export {productsController};