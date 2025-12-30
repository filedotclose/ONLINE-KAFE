import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongodb";
import { decodedToken } from "@/app/api/auth";
import Order from "@/models/order";

export async function GET(req: Request) {
  await connectDB();
  console.log("this is history backend");

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = token ? await decodedToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const orders = await Order.find({ userId: user.id }); // use find, not findOne
    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "no orders found" }, { status: 404 });
    }
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json({ error: "cannot fetch orders" }, { status: 500 });
  }
}