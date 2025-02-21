// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    // Get the cookies store
    const cookieStore = await cookies();

    // Delete the session cookie
    cookieStore.delete({
      name: "session",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    // Return success response
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to logout" },
      { status: 500 }
    );
  }
}
