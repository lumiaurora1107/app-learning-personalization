import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const topicId = searchParams.get("topicId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get dates for planDate starting from tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfDay = new Date(tomorrow);
    endOfDay.setHours(23, 59, 59, 999);

    let whereClause: any = {
      userId,
      planDate: {
        gte: tomorrow,
        lte: endOfDay,
      },
    };

    if (topicId) {
      whereClause.topicId = topicId;
    }

    const existingPlan = await prisma.learningPlan.findFirst({
      where: whereClause,
    });

    if (existingPlan) {
      return NextResponse.json({
        success: true,
        plan: existingPlan,
        isNew: false,
      });
    }

    // Generate a new plan based on feedback
    const cardsNeedingReview = await prisma.studyCard.findMany({
      where: {
        userId,
        ...(topicId ? { topicId } : {}),
      },
      include: {
        feedback: {
          where: { userId },
          orderBy: { reviewedAt: "desc" },
          take: 1,
        },
        topic: true,
      },
    });

    // Prioritize cards based on feedback
    const prioritizedCards = cardsNeedingReview
      .filter((card) => {
        if (card.feedback.length === 0) return true; // New cards
        const latestFeedback = card.feedback[0];
        return (
          latestFeedback.status === "incorrect" ||
          latestFeedback.status === "needs_review"
        );
      })
      .sort((a, b) => {
        if (a.feedback.length === 0) return 1;
        if (b.feedback.length === 0) return -1;
        return (
          new Date(b.feedback[0].reviewedAt).getTime() -
          new Date(a.feedback[0].reviewedAt).getTime()
        );
      })
      .slice(0, 5); // Limit to 5 cards per day

    const focusAreas = Array.from(
      new Set(
        cardsNeedingReview
          .filter((c) => c.feedback.length > 0 && c.feedback[0].status === "incorrect")
          .map((c) => c.topic.title)
      )
    );

    const plan = await prisma.learningPlan.create({
      data: {
        userId,
        topicId: topicId || cardsNeedingReview[0]?.topicId || "",
        planDate: tomorrow,
        cardIds: prioritizedCards.map((c) => c.id),
        focusAreas,
      },
    });

    return NextResponse.json({
      success: true,
      plan,
      isNew: true,
      cards: prioritizedCards,
    });
  } catch (error) {
    console.error("Error generating learning plan:", error);
    return NextResponse.json(
      { error: "Failed to generate learning plan" },
      { status: 500 }
    );
  }
}
