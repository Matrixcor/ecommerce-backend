const loginForm = document.querySelector(".formLogin");

loginForm.addEventListener("submit", async(e)=>{
    //e.preventDefault();
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

});