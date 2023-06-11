const socket = io();

let username;

Swal.fire({ 
    title: "Identificate",
    input: "text",
    text: "Ingresa tu email",
    inputValidator: (value)=>{
        return !value && "Es obligatorio introducir su email"
    },
    allowOutsideClick: false,   
}).then((result)=>{
    username = result.value;
    socket.emit("new-user", username); 
});

const chatInput = document.getElementById("input-chat");
chatInput.addEventListener("keyup",(ev)=>{
    if(ev.key === "Enter"){
        const message = chatInput.value;
        if(message.trim().length > 0){
            socket.emit("new-message", {username, message});
            chatInput.value = "";
        }
    }
})

const panel = document.getElementById("panel");
socket.on("messages", (data)=>{
    let messages ="";
    data.forEach((m)=>{
        messages += `<b> ${m.username}: </b> ${m.message} </br>`;
    });
    panel.innerHTML = messages;
    
})

socket.on("new-user", (username)=>{
    swal.fire({
        title: `${username} se unio al chat`,
        toast: true,
        position: "top-end",
    });
});
