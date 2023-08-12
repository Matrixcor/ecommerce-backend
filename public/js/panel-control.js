
const manageUsers = async()=>{
    const userInfo = await fetch("http://localhost:8080/api/users", {method: "get"})
    .then((res) => res.json()) //debo recibir el id del cart creado
    .then((data) =>{ return data });
    //return userInfo;
    console.log("users", userInfo)
    const data = userInfo.payload;
    const Container = document.querySelector(".manageUser")
    Container.innerHTML = "";
    data.forEach(data => {
        const { _id, first_name, email, role } = data;
        let BoxProduct = document.createElement('tr');
        BoxProduct.innerHTML = `
      
                    <tr>
                        <td>${first_name}</td>
                        <td>${email}</td>
                        <td>${role}</td>
                        <td> <button onclick = 'changeRole("${_id}")'>Cambiar Rol</button> </td>
                        <td> <button onclick= 'deleteUser("${_id}")'>Eliminar usuario</button> </td>
                    </tr>
        `;
        Container.appendChild(BoxProduct);
    });
    
};

const changeRole = async(uid)=>{    
    const userInfo = await fetch(`http://localhost:8080/api/users/premium/${uid}`, {method: "get"})
    .then((res) => res.json())
    .then((data) =>{ return data})
}

const deleteInactiveUsers = async()=>{    
    const userDeleted = await fetch(`http://localhost:8080/api/users/`, {method: "delete"})
    .then((res) => res.json())
    .then((data) =>{ return data})
    const data = userDeleted.payload;
  
    if(data.length == 0){
        const Container = document.querySelector("#deleteUserContainer")
        Container.innerHTML = "";
        let BoxProduct = document.createElement('div');
        BoxProduct.innerHTML = `
            <div>
                <p> No hay usuarios con mas de dos dias de inactividad </p>
            </div>
        `;
        Container.appendChild(BoxProduct);
    }else{
        const Container = document.querySelector(".inactiveUser")
        Container.innerHTML = "";
        data.forEach(data => {
            const { _id, first_name, email, role } = data;
            let BoxProduct = document.createElement('tr');
            BoxProduct.innerHTML = ` 
                <tr>
                    <td>${first_name}</td>
                    <td>${email}</td>
                    <td>${role}</td>
                    <td> <button onclick = 'changeRole("${_id}")'>Cambiar Rol</button> </td>
                    <td> <button onclick= 'deleteUser("${_id}")'>Eliminar usuario</button> </td>
                </tr>
            `;
            Container.appendChild(BoxProduct);
        });
    };
}

const deleteUser = async(uid)=>{
    console.log("ESTA FUNCION AUN NO ESTA INCLUIDA: ", uid)
}