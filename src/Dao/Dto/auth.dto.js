import { createHash, isValidPassword, createToken } from "../../utils.js";

export class createUserDto{
    constructor(user, role){
        const type = role;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.password = createHash(user.password);
        this.cart = user.cart || "";
        this.role = type;
    }
}
export class generateUserForTokenDto{
    constructor(user){
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.cart = user.cart || "";
        this.role = user.role;
    }
}

export class generateEmailForTokenDto{
    constructor(user){
        this.email = user.email;
    }
}