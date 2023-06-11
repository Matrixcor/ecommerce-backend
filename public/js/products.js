const socket = io();

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
            <button id="addProduct" onClick = sendProduct('${_id}')> Agregar al carrito </button>
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

const createCart = async(user)=>{ 
    const datos = await fetch("http://localhost:8080/api/carts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: user})
    })
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) =>{ return data });
    return datos;
}

const addToCart = async(pid, cid)=>{
    const push = await fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, {method: "POST"})
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) => { return data })
}
const handleCart = async(pid)=>{
    let cartId;
    const user = await getUserCart();
    if(!user.cart){ //verifico si el usuario tiene carrito asignado, sino lo creo
        const dataId = await createCart(user.email); //hago fetch y creo el carrito
        cartId = dataId.cartArray._id; 
        addToCart(pid, dataId.cartArray._id); // luego envio el producto para agregar al cart
    }else{
        cartId = user.cart; 
        addToCart(pid, user.cart); //llamo a otro fetch para enviar el producto con el id
    }
}

