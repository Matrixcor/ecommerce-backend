const socket = io();

socket.on("sendDataPurchase",async(updt)=>{
    const data = await updt;   
    const Container = document.querySelector("#cartContainer")
    Container.innerHTML = "";
    data.forEach(data => {
        const { prodTitle, prodPrice, prodImage, prodQuantity, amount } = data;
        
        let BoxCarrito = document.createElement('div');
        BoxCarrito.setAttribute('class','row w-100 shadow-lg p-3 mb-5 bg-light rounded');
        BoxCarrito.innerHTML = `
        <div>
            <div class="col-4 d-flex w-100 align-items-center justify-content-start p-2 border-bottom">
                <img src= "${prodImage}"></img>
                <h3 class="card__titulo"> ${prodTitle} </h3>
            </div> 
            <div class="col-4 d-flex w-100 align-items-center justify-content-between p-2 border-bottom">
                <p class="item-price p-2">Precio por unidad: $ ${prodPrice} </p>
                <p class="item-price p-2"> Cantidad: ${prodQuantity}</p>
                <p class="item-price p-2"> Subtotal:$ ${amount}</p>                
            </div>
        </div>
        `;
        Container.appendChild(BoxCarrito);
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
                <button id="purchase" class="btn btn-primary w-25 me-md-1 mt-2">Hacer Compra</button>
            </a>
        <div>  
    `;
    container.appendChild(BoxProduct);
}
purchase();