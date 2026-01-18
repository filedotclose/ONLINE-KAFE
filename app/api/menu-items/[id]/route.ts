import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "../../mongodb";
import MenuItem from "@/models/menuItem";
import { decodedToken } from "../../auth";
import menuItem from "@/models/menuItem";



export async function PATCH(req : NextRequest, { params } : {params : {id : string}}) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
    const user = token ? decodedToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" },{ status: 401 });}
      const {id} = await params;
      if(!id){
        return NextResponse.json({error : "ItemId required"}, {status : 400 });
      }
  try {
    const current = await menuItem.findById(id);
    const updateItem = await MenuItem.findByIdAndUpdate(id,
      { $set: { available: !current.available } },
      {new : true}
    );
    return NextResponse.json({ message: "Item set to disabled", item: updateItem }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
