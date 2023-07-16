import { enviromentOptions } from "../src/Config/enviroment.options.js";
import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");
let cookie;
let idCartMock;
/*
- Para realizar el test el carrito debe estar logueado, ya que los endpoint verifican el token y el tipo de usuario.
- Por ello debo enviar el token junto con los mock
*/
describe(" Testing del modulo carts ", ()=>{

    it('El endpoint POST /api/sessions/login debe loggear al usuario correctamente y devolver una cookie', async()=>{
        const userLogMock = { //usuario de prueba ya registrado
            email: enviromentOptions.superAdmin.admin_email,
            password: enviromentOptions.superAdmin.admin_password
        }
        const result = await requester.post('/api/sessions/login').send(userLogMock);
        const cookieResult = result.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;
        const cookieData = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }
        cookie = cookieData;
        console.log("cookie sin el carrito: ", cookie)
        expect(cookie.name).to.be.ok.and.equal('cookie-token')
        expect(cookie.value).to.be.ok;
    })

    it('El endpoint POST /api/carts debe crear un carrito exitosamente', async()=>{ 
        /*
        - recibe un token inicial de loggeo, luego si el usuario no tiene carrito, crea el carrito, actualiza y devuelve el nuevo token
        - envio la cookie del loggeo de usuario, luego envio un body correspondiente al  "createCart" de la peticion del front, con el email del usuario
        - una vez creado el carrito y actualizado el profile de usuario, devuelvo la nueva cookie
        */
        const userMock = { 
            email: enviromentOptions.superAdmin.admin_email
        }
        const {statusCode, ok, _body, headers} = await requester.post('/api/carts/').set("cookie",[`${cookie.name} = ${cookie.value}`]).send(userMock)
        //debo leer la cookie generada por el cart controller
        const cookieResult = headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;
        const cookieData = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }
        cookie = cookieData;
        expect(cookie.name).to.be.ok.and.equal('cookie-token')
        expect(cookie.value).to.be.ok;
        //expect(_body.payload).to.have.property('_id');
        console.log(statusCode);
        console.log(ok);
        console.log(_body);
        // leer la cookie y guardar el id del carrito en el idMock
        idCartMock = _body.cartArray._id;
    })
    
    it("El endpoint POST /:cid/products/:pid debe agregar el producto al carrito", async()=>{ // agrega el producto
        let idProdMock = "6498ecdf0dcc3b1814eefa6b"; // el id pertenece a un producto guardado en la DB
        const{
            statusCode, ok
        } = await requester.post(`/api/carts/${idCartMock}/products/${idProdMock}`).set("cookie",[`${cookie.name} = ${cookie.value}`])
        //expect(_body).to.have.property('_id');            
        console.log(statusCode);
        console.log(ok);
    })
    
    it("El endpoint GET /api/carts/:pid debe traer los productos que contenga el carrito", async()=>{
        console.log("idCart: ", idCartMock)
        const{
            statusCode, ok, _body
        } = await requester.get(`/api/carts/${idCartMock}`)
        expect(_body).to.have.property('_id');           
        console.log(statusCode);
        console.log(ok);
        console.log(_body);
    })
})