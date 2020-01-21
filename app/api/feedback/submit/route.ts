import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { cardId, userId, status, rating, notes } = await request.json();

    if (!cardId || !userId || !status) {
      return NextResponse.json(
        { error: "cardId, userId, and status are required" },
        { status: 400 }
      );
    }

    // Update or create feedback
    const feedback = await prisma.feedback.upsert({
      where: {
        cardId_userId: {
          cardId,
          userId,
        },
      },
      update: {
        status,
        rating,
        notes,
        reviewedAt: new Date(),
      },
      create: {
        cardId,
        userId,
        status,
        rating,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
