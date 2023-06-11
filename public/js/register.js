const registerForm = document.querySelector(".formRegister")

registerForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
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
    const body = await response.json();
});