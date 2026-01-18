import { decodedToken } from "@/app/api/auth";
import { connectDB } from "@/app/api/mongodb";
import Category from "@/models/category";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req : NextRequest) {
    await connectDB();
    console.log("category requested");
    // const token = req.headers.get("authorization")?.split(" ")[1];
    // const user = token ? await decodedToken(token) : null
    // if(user == null){
    //     return NextResponse.json({error : "unauthorized"},{status : 401});
    // }

    try{
        const category = await Category.find({});
        return NextResponse.json({categories : category});
    }catch(error){
        return NextResponse.json({error :"failed to find category" },{status : 500})
    }

}