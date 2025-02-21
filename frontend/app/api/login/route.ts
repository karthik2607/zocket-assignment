import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const mockUser = {
  username: "admin",
  password: "password123",
};

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Validate user credentials
    if (username !== mockUser.username || password !== mockUser.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate a JWT session token
    const sessionToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    const cookieManager = await cookies();
    cookieManager.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
