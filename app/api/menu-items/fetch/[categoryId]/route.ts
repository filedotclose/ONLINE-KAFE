import { connectDB } from "@/app/api/mongodb";
import MenuItem from "@/models/menuItem";
import { NextResponse, NextRequest } from "next/server";
import { decodedToken } from "@/app/api/auth";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = token ? await decodedToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { categoryId } = await params;

    console.log("categoryId received:", categoryId);

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "Invalid categoryId" },
        { status: 400 }
      );
    }

    const items = await MenuItem.find({ categoryId });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Fetch menu items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
