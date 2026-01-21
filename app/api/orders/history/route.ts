import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongodb";
import { decodedToken } from "@/app/api/auth";
import history from "@/models/history";

export async function GET(req: Request) {
  await connectDB();
  console.log("this is history backend");

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = token ? await decodedToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const historys = await history.find({ userId: user.id }); // use find, not findOne
    if (!historys || historys.length === 0) {
      return NextResponse.json({ error: "no historys found" }, { status: 404 });
    }
    return NextResponse.json({ historys }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching historys:", error.message);
    return NextResponse.json({ error: "cannot fetch historys" }, { status: 500 });
  }
}