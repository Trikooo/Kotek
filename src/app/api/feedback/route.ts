import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "../APIservices/lib/prisma";
import { feedbackSchema } from "../APIservices/lib/validation";

// POST: Create Feedback
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedFeedback = feedbackSchema.parse(body);

    const feedback = await prisma.feedback.create({
      data: {
        ...validatedFeedback,
        userId: token.id,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("POST Feedback Error:", error);
    return NextResponse.json(
      { message: "Failed to create feedback", error: error },
      { status: 500 }
    );
  }
}

// GET: Retrieve Feedback
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const userId = request.nextUrl.searchParams.get("userId");

    const feedbacks = await prisma.feedback.findMany({
      where: userId
        ? { userId } // Filter by userId if provided
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    console.error("GET Feedback Error:", error);
    return NextResponse.json(
      { message: "Failed to retrieve feedback", error: error },
      { status: 500 }
    );
  }
}
