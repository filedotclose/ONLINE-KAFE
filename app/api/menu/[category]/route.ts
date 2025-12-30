import { connectDB } from "@/app/api/mongodb";
import Category from "@/models/category";
import menuitems from "@/models/menuItem";
import { NextResponse, NextRequest } from "next/server";
import { decodedToken } from "@/app/api/auth";


export async function GET(req: NextRequest, { params }: {params : {category : string}}) {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
        const user = token ? await decodedToken(token) : null
        if(user == null){
            return NextResponse.json({error : "unauthorized"},{status : 400});
        }
    try{
        // const cat = params.category
        // console.log(cat)
        // const category = await Category.findOne({name : cat});
        const { category } = await params;
        const categoryDoc = await Category.findOne({ name: category });
        console.log(categoryDoc)       
        if(!categoryDoc){
            return NextResponse.json({error : "cannot find category"},{status : 500})
        }

        const items = await menuitems.find({ categoryId : categoryDoc._id })
        console.log(items)
        return NextResponse.json({cat : items});

    }catch(error){
        return NextResponse.json({error : "failed finding items"},{status : 500})
    }
}