
const getUserCart = async()=>{ //verifica si el usuario tiene un carrito creado
    const userInfo = await fetch("http://localhost:8080/api/sessions/current", {method: "get"}) //puede presentarse el problema de que el cart del user no se actualice y permita generar mas carritos
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) =>{ 
        console.log(data)
        return data });
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