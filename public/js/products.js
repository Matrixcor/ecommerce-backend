const socket = io();

// asignar valor al id de boton para poder agregar al carrito
//async function sendProduct(pid){
    /* aun no habilito la opcion de colocar los productos en determinado carrito
    
    console.log("envie producto", pid)
    const cartGroup = new cartManagerDb();
    await cartGroup.addProduct(pid)
    */
//}
socket.on("sendData",(result)=>{
    const data = result.payload;
    const Container = document.querySelector("#containerProduct")
    Container.innerHTML = "";
    data.forEach(data => {
        const { _id, title, description, price, code, status, category, stock, thumbnail } = data;
        let BoxProduct = document.createElement('div');
        BoxProduct.innerHTML = `
        <div id=" ${_id}">
            <div>
                <ul>    
                    <li> Title: ${title} </li>
                    <li> Description: ${description} </li>
                    <li> Price: ${price} </li>
                    <li> Code: ${code} </li>
                    <li> Status: ${status} </li>
                    <li> Category: ${category} </li>
                    <li> Stock: ${stock} </li>
                    <li> Thumbnail: ${thumbnail} </li>
                </ul>
            </div>  
            <div>
            <button id="addProduct" onClick = sendProduct("${_id}")> Agregar al carrito </button>
        `;
        Container.appendChild(BoxProduct);
    });
    
});