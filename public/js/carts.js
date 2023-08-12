const socket = io();

socket.on("sendDataCart",async(cartProducts)=>{
    const data = await cartProducts.products;
     
    const Container = document.querySelector("#cartContainer");
    Container.innerHTML = "";
    data.forEach(data => {
        
        const { _id,title, description, price, code, status, category, stock, thumbnail } = data.product;
        let BoxCarrito = document.createElement('div');
        BoxCarrito.setAttribute('class','row w-100 shadow-lg p-3 mb-5 bg-light rounded');
        BoxCarrito.innerHTML = `
        <div>
            <div class="col-4 d-flex w-100 align-items-center justify-content-start p-2 border-bottom">
                <img src= "${thumbnail}"></img>
                <h3 class="card__titulo"> ${title} </h3>
            </div> 
            <div class="col-4 d-flex w-100 align-items-center justify-content-between p-2 border-bottom">
                <p class="item-price p-2">Precio por unidad: $ ${price} </p>
                <p class="item-price p-2"> Cantidad: ${data.quantity}</p>               
            </div>
            </div class="col-4 d-flex w-25 align-items-center justify-content-start  border-bottom" >                   
                <button id="addProduct" class="btn btn-primary w-25 me-md-1 mt-2" onClick = quitProd("${_id}")> Eliminar del Carrito </button>
            </div>
        </div>
        `;
        Container.appendChild(BoxCarrito);
    });
    
    
});

const getUserCart = async()=>{ //verifica si el usuario tiene un carrito creado
    const userInfo = await fetch("/api/sessions/current", {method: "get"}) //puede presentarse el problema de que el cart del user no se actualice y permita generar mas carritos
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) =>{ return data });
    return userInfo;
}
const getCart = async(info)=>{
    const cid = info.cart;
    const push = await fetch(`/api/carts/${cid}`, {method: "GET",  headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    }}) //este activa el socket para mostrar el cart
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
                <button id="purchase"  class="btn btn-primary w-25 me-md-1 mt-2" onclick="purchase()">Finalizar Compra</button>
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
    const push = await fetch(`/api/carts/${cid}/products/${pid}`, {method: "DELETE",  headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    }}) //este activa el socket para mostrar el cart
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) => { return data })
}
const purchase = async()=>{
    const varios = await getUserCart();
    const cid = varios.cart;
    
    const push = await fetch(`/api/carts/${cid}/purchase`, {method: "POST",  headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    }}) //este activa el socket para mostrar el cart
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) => { return data})     
    
}
handle();