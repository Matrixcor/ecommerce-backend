const socket = io();

socket.on("sendData",(data)=>{
    const Container = document.querySelector("#containerProduct")
    Container.innerHTML = "";
    data.forEach(data => {
        let BoxProduct = document.createElement('div');
        BoxProduct.innerHTML = `
        <div>
            <div>
                <ul>
                    <li> <strong>Id:</strong> ${data.id} </li>
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
