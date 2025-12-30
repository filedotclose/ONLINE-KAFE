// app/api/cart/insert/route.ts  (POST)
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/api/mongodb";
import Cart from "@/models/Cart";
import { decodedToken } from "@/app/api/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  const token = req.headers.get("Authorization")?.split(" ")[1];
  const user = token ? await decodedToken(token) : null;
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 400 });
  }

  try {
    const { cartItems } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "no items found" }, { status: 401 });
    }

    let sum = 0;
    for (const item of cartItems) {
      if (typeof item.price !== "number" || typeof item.quantity !== "number") {
        return NextResponse.json(
          { error: "invalid cart item" },
          { status: 400 }
        );
      }
      sum += item.price * item.quantity;
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          cartItems,
          totalprice: sum,
          uat: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    const items = (cart?.cartItems || []).map((ci: any) => ({
      menuItemId: ci.menuItemId ?? ci.menuItemId ?? ci.menuItem,
      menuItem: ci.menuItem ?? ci.name,
      price: ci.price,
      quantity: ci.quantity,
      _id: ci._id,
    }));

    return NextResponse.json(
      { items, total: cart?.totalprice ?? 0 },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error creating cart : ", error);
    return NextResponse.json({ error: "cannot make cart" }, { status: 500 });
  }
}
