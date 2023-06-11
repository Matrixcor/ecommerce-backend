import {EError} from "../Enums/EError.js"

export const errorHandler = (error, req, res, next)=>{
    
    switch(error.code){
        case EError.INVALID_TYPES_ERROR:
            res.json({ status: "error", error: error.cause});
            break;
        case EError.ROUTING_ERROR:
            res.json({ status: "error", error: error.cause});
            break;
        case EError.DATABASE_ERROR:
            res.json({ status: "error", message: error.message});
            break;
        case EError.INVALID_JSON:
            res.json({ status: "error", error: error.cause});
            break;
        case EError.AUTH_ERROR:
            res.json({ status: "error", error: error.cause});
            break;
        default:
            res.json({ status: "error", error: "unHandled error"}); 
    }
    
};