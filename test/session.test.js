import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");
let cookie;

describe(" Testing del modulo Auth ", ()=>{
    describe("Test Register user", async()=>{
        /* 
        - force el test porque la respuesta del servidor supera los 3 segundos
        - el usuario se crea en la Db y devuelve la cookie
        */
        it('El endpoint POST /api/sessions/register debe registrar el usuario exitosamente', async()=>{
            const userMock = {
                first_name: "wade",
                last_name: "wilson",
                email: "z@gmail.com",
                age: 25,
                password: "1234"
            }
            
            const result = await requester.post('/api/sessions/register').send(userMock) // el controller retorna la cookie
            const { statusCode, ok, body } = result;
            const cookieResult = result.headers['set-cookie'][0];
            expect(cookieResult).to.be.ok;
            console.log("cookie Result: ",cookieResult);
        })
        
        it('El endpoint POST /api/sessions/login debe loggear al usuario correctamente y devolver una cookie', async()=>{
            const userLogMock = {
                email: "z@gmail.com",
                password: "1234"
            }
            const result = await requester.post('/api/sessions/login').send(userLogMock);
            const cookieResult = result.headers['set-cookie'][0];
            expect(cookieResult).to.be.ok;
            const cookieData = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            cookie = cookieData;
            expect(cookie.name).to.be.ok.and.equal('cookie-token') //proteger la key con enviroment options
            expect(cookie.value).to.be.ok;
            console.log("cookie: ",cookie)
        })
        
        it("El endpoint GET /api/sessions/current debe obtener la cookie y devolver la informacion del usuario", async()=>{
            const {statusCode, ok, _body} = await requester.get("/api/sessions/current").set("cookie",[`${cookie.name} = ${cookie.value}`])
            expect(_body.email).to.be.equal("z@gmail.com")
            console.log("statusCode: ", statusCode );
            console.log("ok: ", ok)
            console.log("_body: ", _body)
        })
        
    })
    
})