import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topicId = searchParams.get("topicId");
    const userId = searchParams.get("userId");

    if (!topicId || !userId) {
      return NextResponse.json(
        { error: "topicId and userId are required" },
        { status: 400 }
      );
    }

    const cards = await prisma.studyCard.findMany({
      where: { topicId, userId },
      include: {
        feedback: {
          where: { userId },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}
