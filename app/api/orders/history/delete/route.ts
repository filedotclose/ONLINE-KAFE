import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongodb";
import Order from "@/models/order"; // capitalized model
import { decodedToken } from "@/app/api/auth";

export async function DELETE(req: Request) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = token ? await decodedToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const deletedOrder = await Order.findOneAndDelete({ userId: user.id });
    console.log("Deleted order:", deletedOrder);

    if (!deletedOrder) {
      return NextResponse.json({ error: "order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "history cleared" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting order:", err);
    return NextResponse.json({ error: "error deleting order" }, { status: 500 });
  }
}