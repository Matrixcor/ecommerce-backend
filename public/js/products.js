<<<<<<< HEAD
import cartManagerDb from "../../src/Dao/ManagersDb/cartManagerDb";
const socket = io();

// asignar valor al id de boton para poder agregar al carrito
async function sendProduct(pid){
    /* aun no habilito la opcion de colocar los productos en determinado carrito
    
    console.log("envie producto", pid)
    const cartGroup = new cartManagerDb();
    await cartGroup.addProduct(pid)
    */
}
socket.on("sendSearchData",(result)=>{
    const data = result.payload;
    const Container = document.querySelector("#productContainer")
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
=======
const socket = io();

// asignar valor al id de boton para poder agregar al carrito

socket.on("sendData",(data)=>{
    const Container = document.querySelector("#productContainer")
    Container.innerHTML = "";
    data.forEach(data => {
        let BoxProduct = document.createElement('div');
        BoxProduct.innerHTML = `
        <div>
            <div>
                <ul>    
                    <li> Title: ${data.title} </li>
                    <li> Description: ${data.description} </li>
                    <li> Price: ${data.price} </li>
                    <li> Code: ${data.code} </li>
                    <li> Status: ${data.status} </li>
                    <li> Category: ${data.category} </li>
                    <li> Stock: ${data.stock} </li>
                    <li> Thumbnail: ${data.thumbnail} </li>
                </ul>
            </div>  
            <div>
            <button id=""> </button>
>>>>>>> dbb7ca6f5aa706bd5eb215a5d3a8c12ba517f686
            </div>

        </div>
        `;
        Container.appendChild(BoxProduct);
<<<<<<< HEAD
    });     
});
=======
        });
});

//<li> <strong>Id:</strong> ${data.id} </li>
>>>>>>> dbb7ca6f5aa706bd5eb215a5d3a8c12ba517f686
