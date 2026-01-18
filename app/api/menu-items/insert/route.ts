import { connectDB } from "@/app/api/mongodb";
import menuItems from "@/models/menuItem";
import { decodedToken } from "../../auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = token ? decodedToken(token) : null;
  if (user == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.name || !body.categoryId || body.price == 0) {
      return NextResponse.json({error: "Missing required fields" },{ status: 400 });
    }
  try {
    const newItem = new menuItems({
      name: body.name,
      categoryId: body.categoryId,
      price: body.price,
      description: body.description,
      imageUrl: body.imageUrl,
      available: body.available ?? true,
    });
    await newItem.save();

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (err) {
    console.error("error"+err);
    return NextResponse.json({ error: "Failed to add item"}, { status: 500 });
  }
}
