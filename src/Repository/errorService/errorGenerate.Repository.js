
export const generateUserRegErrorInfo = (data)=>{ // esto es la libreria con los errores tipicos
    return `
        Una o mas propiedades estan incompletas o son invalidas.
        Listado de propiedades requeridas:
        * first_name: debe ser un String, recibimos: ${data.first_name}
        * last_name : debe ser un String, recibimos: ${data.last_name}
        * email: debe ser un string, recibimos: ${data.email}
    `
}
export const generateUserLogErrorInfo = (data)=>{ // esto es la libreria con los errores tipicos
    return `
        Una o mas propiedades estan incompletas o son invalidas.
        Listado de propiedades requeridas:
        * password : debe ser un String, recibimos: ${data.password}
        * email: debe ser un string, recibimos: ${data.email}
    `
}
export const authLogErrorInfo = (data)=>{ // esto es la libreria con los errores tipicos
    return `
        el email o el password ingresado son invalidos.
        Listado de propiedades ingresados:
        * password : recibimos: ${data.password}
        * email: recibimos: ${data.email}
    `
}
export const generateProductErrorInfo = (data)=>{
    
    return `
        Una o mas propiedades estan incompletas o son invalidas.
        Listado de propiedades requeridas:

        * title: debe ser un String, recibimos:  ${data.title}
        * description: debe ser un String, recibimos: ${data.description}
        * owner: debe ser un String, recibimos: ${data.owner}
        * price: debe ser Numerico, recibimos: ${data.price}
        * code: debe ser un String, recibimos: ${data.code}
        * status: debe ser un String, recibimos: ${data.status}
        * category: debe ser un String, recibimos: ${data.category}
        * stock: debe ser Numerico, recibimos: ${data.stock}
        * thumbnail: debe ser un String, recibimos: ${data.thumbnail}
    `
}

export const generateNewCartErrorInfo = (data)=>{ // esto es la libreria con los errores tipicos
    return `
        El carrito no se pudo crear.
        El siguiente usuario:
        * email: recibimos: ${data.email}
    `
}
export const generateGetProdCartErrorInfo = (cid)=>{ // esto es la libreria con los errores tipicos
    return `
        El carrito no se pudo obtener debido a que faltan parametros.
        Listado de propiedades requeridas:
        * Cid: recibimos: ${cid}
    `
}
export const generateDelCartErrorInfo = (cid,pid)=>{ // esto es la libreria con los errores tipicos
    return `
        La cantidad de producto del carrito no se pudo actualizar.
        Listado de propiedades requeridas:
        * Cid: recibimos: ${cid}
        * Pid: recibimos: ${pid}
    `
}