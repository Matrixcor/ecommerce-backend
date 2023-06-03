
export const generateUserErrorInfo = (data)=>{ // esto es la libreria con los errores tipicos
    return `
        Una o mas propiedades estan incompletas o son invalidas.
        Listado de propiedades requeridas:
        * first_name: debe ser un String, recibimos: ${data.first_name}
        * last_name : debe ser un String, recibimos: ${data.last_name}
        * email: debe ser un string, recibimos: ${data.email}
    `
}

export const generateProductErrorInfo = (data)=>{
    
    return `
        Una o mas propiedades estan incompletas o son invalidas.
        Listado de propiedades requeridas:

        * title: debe ser un String, recibimos:  ${data.title}
        * description: debe ser un String, recibimos: ${data.description}
        * price: debe ser Numerico, recibimos: ${data.price}
        * code: debe ser un String, recibimos: ${data.code}
        * status: debe ser un String, recibimos: ${data.status}
        * category: debe ser un String, recibimos: ${data.category}
        * stock: debe ser Numerico, recibimos: ${data.stock}
        * thumbnail: debe ser un String, recibimos: ${data.thumbnail}
    `
}