import {productManagerDb} from "../Dao/Mongo/productManagerDb.js";
import { viewsService } from "../Services/views.Service.js";
import cartManagerDb from "../Dao/Mongo/cartManagerDb.js";

const groupProducts = new productManagerDb();
const groupCarts = new cartManagerDb();

class viewsController {
    static homeViewController = async(req,res)=>{
        const homeProducts = await viewsService.homeGetProdService();
        const arrayProd = homeProducts.payload;
        res.render("home", {arrayProd});
    };

    static realTimeViewController = (req,res)=>{
        const realTimeArray = [];
        res.render('real_time_products', realTimeArray);
    };
    
    static chatViewController= async(req,res)=>{
        try{
            res.render("chat");
        }catch(error){
            res.render("error");
        }
    };
    
    static cartProdViewController = async(req,res)=>{
        try{
            const { cid } = req.params;
            const cartsArray = await groupCarts.getProductsInCart(cid);
            let prod = [];
            for(let i=0 ; i< cartsArray.products.length ; i++){
                const objt = { 
                    id: cartsArray.products[i].product._id,
                    quantity: cartsArray.products[i].quantity
                };
                prod.push({...objt})
            }
            res.render("carts",{prod});
    
        }catch(error){
            res.render("error");
        }
    };
    
    // vistas web
    
    static prodsViewController = async(req,res)=>{
        try{
            const arrayViewProd = await groupProducts.getViewProducts();
            const dataLoginUser = "";
            
            const data = { arrayViewProd, dataLoginUser }
            res.render("products", {data});
        }catch(error){
            res.render("error");
        }
    };
    
    static loginViewController = async(req,res)=>{
        try{
            res.render("login");
        }catch(error){
            res.render("error");
        }
    };
    
    static registerViewController = async(req,res)=>{
        try{
            res.render("register");
        }catch(error){
            res.render("error");
        }
    };
    
    static profileViewController = async(req,res)=>{
        try{
            const dataUser = req.body;
            //console.log(dataUser)
            res.render("profile");
        }catch(error){
            res.render("error");
        }
    };
}

export { viewsController };


/*
export const realTimeViewController = (req,res)=>{
    const realTimeArray = [];
    res.render('real_time_products', realTimeArray);
};

export const chatViewController= async(req,res)=>{
    try{
        res.render("chat");
    }catch(error){
        res.render("error");
    }
};

export const cartProdViewController = async(req,res)=>{
    try{
        const { cid } = req.params;
        const cartsArray = await groupCarts.getProductsInCart(cid);
        let prod = [];
        for(let i=0 ; i< cartsArray.products.length ; i++){
            const objt = { 
                id: cartsArray.products[i].product._id,
                quantity: cartsArray.products[i].quantity
            };
            prod.push({...objt})
        }
        res.render("carts",{prod});

    }catch(error){
        res.render("error");
    }
};

// vistas web

export const prodsViewController = async(req,res)=>{
    try{
        const arrayViewProd = await groupProducts.getViewProducts();
        const dataLoginUser = "";
        //req.session.user;
        const data = { arrayViewProd, dataLoginUser }
        res.render("products", {data});
    }catch(error){
        res.render("error");
    }
};

export const loginViewController = async(req,res)=>{
    try{
        res.render("login");
    }catch(error){
        res.render("error");
    }
};

export const registerViewController = async(req,res)=>{
    try{
        res.render("register");
    }catch(error){
        res.render("error");
    }
};

export const profileViewController = async(req,res)=>{
    try{
        const dataUser = req.body;
        console.log(dataUser)
        res.render("profile");
    }catch(error){
        res.render("error");
    }
};
*/