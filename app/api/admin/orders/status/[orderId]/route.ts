import { NextResponse, NextRequest } from "next/server";
import Order from "@/models/order";
import { connectDB } from "@/app/api/mongodb";
import { decodedToken } from "@/app/api/auth";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = token ? await decodedToken(token) : null;

    if (!user) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await params;

   
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { error: "invalid order id" },
        { status: 400 }
      );
    }

    
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "order not found" },
        { status: 404 }
      );
    }

    
    if (order.userId.toString() !== user.id) {
      return NextResponse.json(
        { error: "forbidden" },
        { status: 403 }
      );
    }

   
    return NextResponse.json(
      { payment: order.payment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order status error:", error);
    return NextResponse.json(
      { error: "failed to fetch order status" },
      { status: 500 }
    );
  }
}
