import { enviromentOptions } from "../Config/enviroment.options.js";

const persistence= enviromentOptions.server.persistence;

let connProdDao;
let connCartDao;
let connAuthDao;
let connTicketDao;
let connUserDao;

switch(persistence){
    case "MONGO":
        const { default: connectDB } = await import ('../Config/dBConnections.js')
        connectDB;
        const { userManagerDb } = await import('../Dao/Mongo/userManagerDb.js');
        const { authManagerDb } = await import('../Dao/Mongo/authManagerDb.js');
        const { cartManagerDb } = await import('../Dao/Mongo/cartManagerDb.js');
        const { productManagerDb } = await import("./Mongo/productManagerDb.js");
        const { ticketManagerDb } = await import('../Dao/Mongo/ticketManagerDb.js');

        connUserDao = new userManagerDb();
        connAuthDao = new authManagerDb();
        connCartDao = new cartManagerDb();
        connProdDao = new productManagerDb();
        connTicketDao = new ticketManagerDb();

        break;

    case "FILESYSTEM":
        const { cartManagerFs } = await import('../Dao/FileSystem/cartManagerFs.js');
        const { productManagerFs } = await import('../Dao/FileSystem/productManagerFs.js')
        //const { authManagerFs } = await import('../Dao/FileSystem/authManagerFs.js');
        connCartDao = new cartManagerFs("./src/Dao/FileSystem/Json/carts.json");
        connProdDao = new productManagerFs("./src/Dao/FileSystem/Json/products.json");

        break;
};

export { connUserDao, connAuthDao, connCartDao, connProdDao, connTicketDao};