export class customErrorRepository{
    static createError({ name = "Error", cause, message, errorCode }){
        const error = new Error(message, { cause });
        error.name = name;
        error.code = errorCode;
        console.log("custom error: ", error.cause) // muestra el error generado
        throw error;
    };
};