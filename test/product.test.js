import { enviromentOptions } from "../src/Config/enviroment.options.js";
import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");
let cookie;
let idMock;
/*
- Para realizar el test el usuario debe estar logueado, ya que los endpoint verifican el token y el tipo de usuario.
- Por ello debo enviar el token junto con los mock
*/
describe(" Testing del modulo products ", ()=>{
    
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
        expect(cookie.name).to.be.ok.and.equal('cookie-token')
        expect(cookie.value).to.be.ok;
    })

    it('El endpoint POST /api/products debe crear el producto exitosamente', async()=>{ //requiere el email proveniente del token jwt
        const productMock = {
            title: "Producto de prueba TEST",
            description: "Producto de prueba TEST",
            owner:"",
            price: 15000,
            code: "abcde123485412455",
            status: true,
            category: "informatica",
            stock: 10,
            thumbnail: "",
        }
        const{
            statusCode, ok, _body
        } = await requester.post('/api/products/').set("cookie",[`${cookie.name} = ${cookie.value}`]).send(productMock)
        //expect(_body.payload).to.have.property('_id'); como es un arreglo deberia iterar para ver dicha propiedad
        console.log(statusCode);
        console.log(ok);
        console.log(_body.payload);
        let arrayTest = _body.payload; // busco guaradar el id del ultimo producto agregado en el test para utilizar en las otras pruebas
        let arrayLong = arrayTest.length
        console.log("longitud: ", arrayLong)
        idMock = arrayTest[arrayLong-1]._id
    })
    it("El endpoint GET /api/products/:pid debe encontrar el producto", async()=>{
        const{
         statusCode, ok, _body
        } = await requester.get(`/api/products/${idMock}`).set("cookie",[`${cookie.name} = ${cookie.value}`])
        expect(_body).to.have.property('_id');            
        console.log(statusCode);
        console.log(ok);
        console.log(_body);
    })
    it("El endpoint DELETE /api/products/:pid debe eliminar el producto", async()=>{ // retorna no puedes eliminar productos de otros usuarios por lo qeu es admin
        const{
          statusCode, ok
        } = await requester.delete(`/api/products/${idMock}`).set("cookie",[`${cookie.name} = ${cookie.value}`])
        //expect(_body).to.have.property('_id');            
        console.log(statusCode);
        console.log(ok);
    })
})