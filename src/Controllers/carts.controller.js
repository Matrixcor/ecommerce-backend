import { cartServices, productServices, ticketServices } from "../Repository/index.Repository.js";

import { customErrorRepository } from "../Repository/errorService/customError.Repository.js";
import { generateNewCartErrorInfo, generateGetProdCartErrorInfo, generateDelCartErrorInfo } from "../Repository/errorService/errorGenerate.Repository.js"
import { EError } from "../Enums/EError.js";
import { currentLogger } from "../Repository/logger.js";

const logger = currentLogger();
class cartController{
    static newCartController = async(req,res, next)=>{
        try{
            const data = req.body;
            const newCart =  await cartServices.newCartService(data); //recibo el usuario actualizado con el id del carrito, retorna el token para actualizar
            if( newCart.status != "Error" ){
                logger.info("Carrito generado correctamente")
                res.cookie("cookie-token", newCart.data.updateUser.newUserToken, {maxAge: 60*60*1000, httpOnly: true}); //aca debo actualizar el token
            }else{
                logger.error("Error en newCartController - No se pudo actualizar el carrito dell perfil del uasuario ")
                customErrorRepository.createError({
                    name: "User Login Error",
                    cause: generateNewCartErrorInfo(data),
                    message: "Error, los datos ingresados son incorrectos",
                    errorCode: EError.INVALID_JSON
                });
            }
            res.json(newCart.data.newCarry);
        }catch(error){
            next(error);
        }
    };

    static getProdCart = async(req,res, next)=>{
        try{
            const { cid } = req.params;
            if(!cid){
                logger.warning("Faltan parametros Cid")
                customErrorRepository.createError({
                    name: "Cart id Error",
                    cause: generateGetProdCartErrorInfo(cid),
                    message: "Error, Falta el identificador de carrito",
                    errorCode: EError.INVALID_JSON
                }); 
            } 
            const cartProducts = await cartServices.getProdCartService(cid);
            req.io.emit("sendDataCart", cartProducts);
            res.send(cartProducts);
        }catch(error){
            next(error);
        }
    };

    static addProdCartController = async(req,res, next)=>{
        try{
            const data = req.params;
            const productAdded = await cartServices.addProdCartService(data);
            if(createdProduct.status !== "Error"){
                logger.info("El producto se agrego exitosamente");
                req.io.emit("sendDataCart", productAdded.payload);
                res.json(productAdded);
            }else{
                logger.warning("El producto no se pudo agregar ");
                logger.error("Error en addProdCartController - Producto existente");
                customErrorRepository.createError({
                    name: "Add prod Cart Error",
                    cause: generateGetProdCartErrorInfo(cid),
                    message: "Error, no se pudo agregar el producto al carrito",
                    errorCode: EError.INVALID_JSON
                });
                res.status(409).json(productAdded.message);
            }
        }catch(error){
            next(error);
            //res.status(404).send("no se pudo actualizar el producto");
        }
    };

    static delProdCartController = async(req,res, next)=>{
        try{
            const { cid, pid } = req.params;
            const productDeleted = await cartServices.delProdCartService(cid,pid);
            if(productDeleted.status !== "Error"){
                logger.info("producto eliminado")
                req.io.emit("sendDataCart", productDeleted);
                res.json(productDeleted);
            }else{
                customErrorRepository.createError({
                    name: "Delete prod Cart Error",
                    cause: generateDelCartErrorInfo(cid, pid),
                    message: "Error, no se pudo actualizar la cantidad de productos del carrito",
                    errorCode: EError.INVALID_JSON
                });
            };
        }catch(error){
            next(error);
            //res.status(404).send("no se pudo actualizar el producto");
        }
    };

    static delAllProdCartController = async(req,res, next)=>{
        try{
            const { cid } = req.params;
            if(!cid){
                logger.warning("Error, flata identificador de carrito");
                customErrorRepository.createError({
                    name: "Delete all Cart Error",
                    cause: generateGetProdCartErrorInfo(cid),
                    message: "Error, no se pudo eliminar el carrito porque falta el CID",
                    errorCode: EError.INVALID_JSON
                });
            }
            const allProductsDeleted = await cartServices.delAllProdCartService(cid);
            if(allProductsDeleted.status !== "Error"){
                req.io.emit("sendDataCart", allProductsDeleted);
                res.send(allProductsDeleted);
            }else{
                logger.error("Error en delAllProdCartController - No se pudo obtener el carrito o actualizar el carrito");
                customErrorRepository.createError({
                    name: "Delete all Cart Error",
                    cause: generateGetProdCartErrorInfo(cid),
                    message: "Error, no se pudo eliminar el carrito debido a causas internas",
                    errorCode: EError.INVALID_JSON
                });
            }
        }catch(error){
            next(error);
            //res.status(404).send("no se pudo actualizar el Carrito");
        }
    };

    static purchaseCartController = async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const cart = await cartServices.getProdCartService(cartId); // lo que hay en el carrito
            const carts = cart.products;
            const final = await cartServices.updateCartService(carts, cartId)
            req.io.emit("sendDataPurchase", final.cartChecked);
            res.json(final.cartChecked)
        } catch (error) {
            res.status(404).send("no se pudo concretar la Compra");
        }         
    }
}

export { cartController }