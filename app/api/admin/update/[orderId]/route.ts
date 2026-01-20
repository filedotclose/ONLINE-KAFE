import { NextResponse, NextRequest } from "next/server";
import Order from "@/models/order";
import { connectDB } from "@/app/api/mongodb";
import { decodedToken } from "@/app/api/auth";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = token ? await decodedToken(token) : null;

    
    if (!user ) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "invalid mongo id" }, { status: 400 });
    }

    const { payment } = await req.json();

    
    if (!["paid", "unpaid", "rejected"].includes(payment)) {
      return NextResponse.json(
        { error: "invalid payment status" },
        { status: 400 }
      );
    }

    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { payment },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "order updated", order: updatedOrder },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "failed to update order" },
      { status: 500 }
    );
  }
}
