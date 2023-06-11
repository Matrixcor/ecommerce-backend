const socket = io();

socket.on("sendDataPurchase",async(updt)=>{
    const data = await updt;   
    const Container = document.querySelector("#cartContainer")
    Container.innerHTML = "";
    data.forEach(data => {
        const { prodTitle, prodPrice, prodImage, prodQuantity, amount } = data;
        let BoxProduct = document.createElement('div');
        BoxProduct.innerHTML = `
        <div>
            <div>
                <ul>    
                    <li> Title: ${prodTitle} </li>
                    <li> Price: ${prodPrice} </li>
                    <li> Thumbnail: ${prodImage} </li>
                    <li> Quantity: ${prodQuantity} </li>
                    <li> Subtotal: <b>$</b> ${amount} </li>
                </ul>
            </div>
        <div>
        `;
        Container.appendChild(BoxProduct);
    });
    
});
const getUserCart = async()=>{ //verifica si el usuario tiene un carrito creado
    const userInfo = await fetch("http://localhost:8080/api/sessions/current", {method: "get"}) //puede presentarse el problema de que el cart del user no se actualice y permita generar mas carritos
    .then((res) => res.json()) // recibo el id del cart creado
    .then((data) =>{ return data });
    return userInfo;
}

const purchase = async()=>{
    const varios = await getUserCart();
    const cid = varios.cart;
    const push = await fetch(`http://localhost:8080/api/carts/${cid}/purchase`, {method: "POST"}) //este activa el socket para mostrar productos del purchase
    .then((res) => res.json()) // recibo los productos que pasaron el proceso de compra
    .then((data) => { return data }) 
    createTicketButton(cid);
}

const createTicketButton = async(cid)=>{
    const container = document.querySelector("#createTicketButton")
    container.innerHTML = "";
    let BoxProduct = document.createElement('div');
    BoxProduct.innerHTML = `
        <div>
            <a href="/${cid}/ticket">
                <button id="purchase")>Hacer Compra</button>
            </a>
        <div>  
    `;
    container.appendChild(BoxProduct);
}
purchase();