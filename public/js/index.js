
const socket = io();
console.log("ingresa al archivo")

socket.on("sendData",(data)=>{
    console.log(data)
    const Container = document.querySelector("#containerProduct")
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
        </div>
        `;
        Container.appendChild(BoxProduct);
        });
});