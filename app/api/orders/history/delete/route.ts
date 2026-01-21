import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongodb";
import history from "@/models/history"; 
import { decodedToken } from "@/app/api/auth";

export async function DELETE(req: Request) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = token ? await decodedToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const deletedhistory = await history.findOneAndDelete({ userId: user.id });
    console.log("Deleted history:", deletedhistory);

    if (!deletedhistory) {
      return NextResponse.json({ error: "history not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "history cleared" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting history:", err);
    return NextResponse.json({ error: "error deleting history" }, { status: 500 });
  }
}