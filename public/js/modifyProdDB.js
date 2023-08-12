const handleProd = async(pid)=>{
    const push = await fetch(`/api/products/${pid}`, {method: "DELETE",  headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    }})
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) => { return data })
    
};