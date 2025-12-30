import { decodedToken } from "@/app/api/auth";
import { connectDB } from "@/app/api/mongodb";
import Order from "@/models/order";
import Cart from "@/models/Cart";
import { NextResponse,NextRequest } from "next/server";


export async function POST(req:NextRequest) {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = token ? await decodedToken(token) : null
    if(user === null){
        return NextResponse.json({error : "unathorized"},{status : 401})
    }
    try{
        const cart = await Cart.findOne({userId : user.id})
        if(!cart || cart.cartItems.length == 0) return NextResponse.json({error :"cart empty"},{status : 500})
        const OID = "ORDER" + Math.floor(Math.random()* 2134314);
        const newOrder = new Order({
            userId : user.id,
            orderItems : cart.cartItems,
            totalprice : cart.totalprice,
            payment : "unpaid",
            orderId : OID
        })
        await newOrder.save();
        
        console.log(newOrder.orderId)
        await Cart.deleteOne({userId : user.id})
        return NextResponse.json({newOrder : newOrder},{status : 200})
    }catch(e){
        console.error("error is ", e);
        return NextResponse.json({error : "cant find orders"},{status : 500});
    }
}