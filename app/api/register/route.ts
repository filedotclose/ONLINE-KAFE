import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import z from 'zod';
import { connectDB } from "@/app/api/mongodb";
import bcrypt from "bcryptjs";


const reqSchema = z.object({
    name : z.string(),
    email : z.string(),
    password : z.string().min(6),
    confirmPassword : z.string().min(6),
})

export async function POST(req : NextRequest){
    try{
        await connectDB();
        const body = await req.json();
        const parsedBody = reqSchema.safeParse(body);
        if(!parsedBody.success){
            return NextResponse.json({error : "Enter a Valid Password"},{status : 500})
        }
        const {name, email, password, confirmPassword} = parsedBody.data;
        
        if (!email.endsWith("@kiit.ac.in")) {
            return NextResponse.json({ error: "Only Kiit addresses are allowed." }, { status: 500 });
        }
        if(password != confirmPassword){
            return NextResponse.json(
                {error : "Passwords do not match"}, {status : 500}
            )
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error : "you already exist"}, {status : 500})
        }

        const hashedPassword = await bcrypt.hash(password, 11);
        
        const newUser = await User.create({
            name,
            email,
            password : hashedPassword
        })
        // await newUser.save();
        return NextResponse.json({message : "user registered"}, {status : 200})
    }catch(error){
        console.log("Error while registering user", error)
        return NextResponse.json(
            {error: "Internal server error"},
            { status : 500}
        )
    }
}