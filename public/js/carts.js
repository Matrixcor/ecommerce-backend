const socket = io();

socket.on("sendDataCart",async(cartProducts)=>{
    const data = await cartProducts.products;
    const Container = document.querySelector("#cartContainer")
    Container.innerHTML = "";
    data.forEach(data => {
        const { _id,title, description, price, code, status, category, stock, thumbnail } = data.product;
        let BoxProduct = document.createElement('div');
        BoxProduct.innerHTML = `
        <div>
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
                    <li> Quantity: ${data.quantity} </li>
                </ul>
            </div>
            <div>
            <button id="addProduct" onClick = quitProd("${_id}")> Eliminar del Carrito </button>
        `;
        Container.appendChild(BoxProduct);
    });
});

const getUserCart = async()=>{ //verifica si el usuario tiene un carrito creado
    const userInfo = await fetch("http://localhost:8080/api/sessions/current", {method: "get"}) //puede presentarse el problema de que el cart del user no se actualice y permita generar mas carritos
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) =>{ return data });
    return userInfo;
}
const getCart = async(info)=>{
    const cid = info.cart;
    const push = await fetch(`http://localhost:8080/api/carts/${cid}`, {method: "GET"}) //este activa el socket para mostrar el cart
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) =>{
    return data;
    })
    return push;
}
const createPurchaseBtn = async(cid)=>{ //con esta funcion creo el boton de purchase lo cual tambien me completa el link href y puedo redireccionar
    const container = document.querySelector("#btnContainer")
    container.innerHTML = "";
    let BoxProduct = document.createElement('div');
    BoxProduct.innerHTML = `
        <div>
            <a href="/${cid}/purchase">
                <button id="purchase" onclick="purchase()">Finalizar Compra</button>
            </a>
        <div>  
        `;
    container.appendChild(BoxProduct);
}

const handle = async()=>{ // utilizo este handle para activar el socket
    const info = await getUserCart();
    getCart(info);
    createPurchaseBtn(info.cart);
}
const quitProd = async(pid)=>{ // cuando presiono el boton de eliminar hago la peticion al endpoint, el cual responde con el socket y actualiza la vista del cart   
    const varios = await getUserCart();
    const cid = varios.cart;
    const push = await fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, {method: "DELETE"}) //este activa el socket para mostrar el cart
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) => { console.log(data) })
}
const purchase = async()=>{
    const varios = await getUserCart();
    const cid = varios.cart;
    /*
    const push = await fetch(`http://localhost:8080/api/carts/${cid}/purchase`, {method: "POST"}) //este activa el socket para mostrar el cart
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) => { console.log(data)})     
    */
}
handle();




