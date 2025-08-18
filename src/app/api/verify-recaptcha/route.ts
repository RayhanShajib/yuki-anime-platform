import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA token is required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify the reCAPTCHA token with Google
    const verifyResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.success && verifyData.score > 0.5) {
      return NextResponse.json({
        success: true,
        message: "reCAPTCHA verified successfully",
        score: verifyData.score,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "reCAPTCHA verification failed",
          errors: verifyData["error-codes"] || [],
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
