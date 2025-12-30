import { decodedToken } from "../../auth";
import { connectDB } from "../../mongodb";
import order from "@/models/order";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = token ? await decodedToken(token) : null;

  if (user === null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, payment } = await req.json();

    if (!orderId || !payment) {
      return NextResponse.json(
        { error: "Missing order id or payment" },
        { status: 400 }
      );
    }
    const updatedOrder = await order.findOneAndUpdate(
      {
        userId: user.id,
        orderId: orderId,
      },
      {
        $set: {
          payment: payment,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Payment status updated",
        orderId: updatedOrder.orderId,
        payment: updatedOrder.payment,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error occured", err);
    return NextResponse.json({ error: "cannot update cart" }, { status: 500 });
  }
}
