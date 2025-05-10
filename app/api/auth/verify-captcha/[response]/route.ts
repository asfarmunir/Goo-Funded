import { NextRequest, NextResponse } from "next/server";

// Ensure that you define the secret in your environment variables (for security)
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const { response } = await req.json(); // Get the reCAPTCHA response from the request body

    if (!response) {
      return NextResponse.json({ success: false, message: "No reCAPTCHA token provided." });
    }

    // Send verification request to Google's reCAPTCHA API
    const verificationResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // `secret=${RECAPTCHA_SECRET}&response=${response}`
      body: JSON.stringify({
        secret: RECAPTCHA_SECRET,
        response,
      }),
    });

    const apiResponse = await verificationResponse.json();

    if (apiResponse.success) {
      return NextResponse.json({ success: true, message: "reCAPTCHA verified successfully." });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to verify reCAPTCHA.",
        'error-codes': apiResponse['error-codes'] || []
      });
    }
  } catch (error: any) {
    console.error("Error verifying reCAPTCHA:", error);
    return NextResponse.json({ success: false, message: "Server error during reCAPTCHA verification." });
  }
}
