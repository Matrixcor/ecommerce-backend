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
            </div>

        </div>
        `;
        Container.appendChild(BoxProduct);
        });
});

//<li> <strong>Id:</strong> ${data.id} </li>