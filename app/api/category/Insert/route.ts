import { decodedToken } from "@/app/api/auth";
import { connectDB } from "@/app/api/mongodb";
import Category from "@/models/category";
import { NextResponse, NextRequest } from "next/server";
import z from "zod";

const reqSchema = z.object({
  name: z.string(),
  icon: z.string(),
});

export async function POST(req: NextRequest) {
  await connectDB();
  console.log("category insertion requested");

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

    const { name, icon } = parsedBody.data;

    const category = await Category.findOne({ name });
    if (category) {
      return NextResponse.json({ error: "category already exists" }, { status: 409 });
    }

    const newCategory = new Category({ name, icon });
    await newCategory.save();

    return NextResponse.json({ message: "New category created" }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "failed to add category: " + error.message }, { status: 500 });
  }
}