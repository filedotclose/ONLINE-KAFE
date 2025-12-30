import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/api/mongodb";
import { decodedToken } from "@/app/api/auth";
import Cart from "@/models/Cart";

export async function GET(req: NextRequest) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = token ? await decodedToken(token) : null;
  if (user == null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  //     try{
  //         const dispCart = await Cart.findOne({ userId : user.id})
  //         if(!dispCart){
  //             return NextResponse.json({cartItems : []})
  //         }
  //         return NextResponse.json({cartItems : dispCart.cartItems});
  //     }catch(error){
  //         console.error("Error fetching card", error);
  //         return NextResponse.json({error : "cannot fetch cart"},{status : 500})
  //     }
  // }
  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) {
    return NextResponse.json({ items: [], total: 0 }, { status: 200 });
  }

  const items = cart.cartItems.map((ci: any) => ({
    menuItemId: ci.menuItemId ?? ci.menuItemId ?? ci.menuItem,
    menuItem: ci.menuItem ?? ci.name,
    price: ci.price,
    quantity: ci.quantity,
    _id: ci._id,
  }));

  return NextResponse.json(
    { items, total: cart.totalprice ?? 0 },
    { status: 200 }
  );
}
