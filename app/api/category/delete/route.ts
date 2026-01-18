import { decodedToken } from "@/app/api/auth";
import { connectDB } from "@/app/api/mongodb";
import Category from "@/models/category";
import { NextResponse, NextRequest } from "next/server";
import z from "zod";

const reqSchema = z.object({
  name: z.string(),
});

export async function DELETE(req: NextRequest) {
  await connectDB();
  console.log("category deletion requested");

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = token ? await decodedToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsedBody = reqSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ error: "enter valid details sir" }, { status: 400 });
    }

    const { name } = parsedBody.data;

    const deleted = await Category.findOneAndDelete({ name });
    if (!deleted) {
      return NextResponse.json({ error: "category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "failed to delete category: " + error.message }, { status: 500 });
  }
}