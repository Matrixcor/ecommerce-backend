/*
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
*/
console.log("vista nueva")

const loginForm = document.getElementById("formLogin");
const registerForm = document.getElementById("formRegister");
const sendReg = document.getElementById("registerButton");
const registerbtn = document.getElementById("registerButton");

loginForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    
    const formData = {
        email: loginForm.email.value,
        password: loginForm.password.value
    };

    const response = await fetch("api/sessions/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const body = await response.json();
    console.log(body)

});

registerbtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const container = document.querySelector(".container");
    container.innerHTML = "";
    let boxContainer = document.createElement('div');
    boxContainer.innerHTML = `
        <div class="formContainer">
            <form id="formRegister" class="form">
                <div class="InputContainer">
                    <label > Nombre: </label>
                    <input type="text" placeholder="Escriba aqui su nombre" name="first_name">
                </div>
                <div class="InputContainer">
                    <label > Apellido: </label>
                    <input type="text" placeholder="Escriba aqui su apellido" name="last_name">
                </div>
                <div class="InputContainer">
                    <label > Ingrese su edad: </label>
                    <input type="text" placeholder="Escriba aqui su Edad" name="age">
                </div>
                <div class="InputContainer">
                    <label > Email: </label>
                    <input type="text" placeholder="Escriba aqui su Email" name="email">
                </div>
                <div class="InputContainer">
                    <label> Contraseña: </label>
                    <input type="password" placeholder="Escriba aqui su contraseña" name="password">             
                </div>
            </form>
            <div class="butonContainer">
                <button onClick="registro()">register</button>
            </div>
        </div>
    `
    container.appendChild(boxContainer);
});
const registro = async()=>{
    const registerForm = document.getElementById("formRegister");
    const formData = {
        first_name: registerForm.first_name.value,
        last_name: registerForm.last_name.value,
        age: registerForm.age.value,
        email: registerForm.email.value,
        password: registerForm.password.value
    };

    const response = await fetch("api/sessions/register", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    console.log(formData)
    const body = await response.json();
    console.log(body)
};