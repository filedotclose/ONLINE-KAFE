import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "../../mongodb";
import order from "@/models/order";
import { decodedToken } from "../../auth";


export async function GET(req : NextRequest){
    await connectDB();
    const token  = req.headers.get("authorization")?.split(" ") [1];
    const user = token? decodedToken(token) : null;
    if(user == null){
        return NextResponse.json({error : "unauthorized"},{status : 401});
    }

    try{

        const orders = await order.find({}).sort({iat : -1});
        if(!orders){
            return NextResponse.json({error : "cannot find orders"},{status : 500});
        }
        return NextResponse.json({message : "orders fetched",orders : orders}, {status : 201})
    }catch(error){
        return NextResponse.json({error : "error finding orders"},{status : 500});
    }

}