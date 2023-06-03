import {EErrors} from "../Enums/EError.js"

export const errorHandler = (error, req, res, next)=>{
    console.log("captura el middle", error)
    
    switch(error.code){
        case EErrors.INVALID_TYPES_ERROR:
            res.json({ status: "Error", error: error.cause});
            break;
        case EErrors.ROUTING_ERROR:
            res.json({ status: "Error", error: error.cause});
            break;
        case EErrors.DATABASE_ERROR:
            res.json({ status: "Error", error: error.name});
            break;
        case EErrors.IVALID_JSON:
            res.json({ status: "Error", error: error.name});
            break;
        case EErrors.AUTH_ERROR:
            res.json({ status: "Error", error: error.name});
            break;
        default:
            next(err);
            res.json({ status: "Error", error: "unHandled error"}); 
    }
}