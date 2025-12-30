import { NextResponse,NextRequest } from "next/server";
import { connectDB } from "@/app/api/mongodb";
import { decodedToken } from "@/app/api/auth";
import Cart from "@/models/Cart";

export async function DELETE(req:NextRequest) {
    await connectDB();

    const token  = req.headers.get("authorization")?.split(" ")[1];
    const user = token? await decodedToken(token) : null
    if(user == null){
        return NextResponse.json({error : "unauthorized"},{status : 500});    
    }

    try{
        const delcart = await Cart.findOne({userId : user.id})
        console.log(delcart)
        if(!delcart){
            return NextResponse.json({error : "cart cannot be found"},{status : 500})
        }
        await Cart.deleteOne({userId : user.id})
        return NextResponse.json({message : "cart cleared"}, {status : 200});
    }
    catch(error){
        return NextResponse.json({error : "cannot clear cart"},{status : 500});    
    }
}