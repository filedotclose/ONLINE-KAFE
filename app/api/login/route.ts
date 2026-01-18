import { connectDB } from "@/app/api/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import z from "zod";
import jwt from "jsonwebtoken";

const reqShcema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsedBody = reqShcema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 500 }
      );
    }

    const {password } = parsedBody.data;
    let  {email} = parsedBody.data;
    email = email.toLowerCase();
    const exist = await User.findOne({ email });

    if (!exist) {
      return NextResponse.json({ error: "User doesnt exist" }, { status: 500 });
    }

    const isValidPass = await bcrypt.compare(password, exist.password);

    if (!isValidPass) {
      return NextResponse.json({ error: "invalid password" }, { status: 500 });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("no secret key found");
    }

    const token = jwt.sign(
      {
        id: exist._id,
        name: exist.name,
        email: exist.email,
      },
      process.env.SECRET_KEY,
      //  { expiresIn: "10m" }
    );

    const response =  NextResponse.json(
      {
        message: "Login successful",
        token,
        user: { id: exist._id, name: exist.name, email: exist.email },
      },
      { status: 200 }
      
    );
    response.cookies.set("token", token, {
      httpOnly : true,
      secure : process.env.NODE_ENV === "production",
      sameSite : "strict",
      path : "/",
      // maxAge : 60 * 10
    })
    return response;
  } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
  }
}
