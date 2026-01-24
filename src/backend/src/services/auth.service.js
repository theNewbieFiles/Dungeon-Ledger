import { ok, fail } from "../utilities/message.js";
import { loginSchema } from "../validation/auth.schema.js";
import { errorCode } from "../utilities/errorCode.js";

export function login({email, password}){


    const parsedResult = loginSchema.safeParse({email, password});

    if(!parsedResult.success){
        return fail(errorCode.BAD_REQUEST, "Invalid email or password format");
    }



    return ok("Hello World"); 
}  