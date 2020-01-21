import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, title, description } = await request.json();

    if (!userId || !title) {
      return NextResponse.json(
        { error: "userId and title are required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return NextResponse.json({ success: true, topic });
  } catch (error: any) {
    console.error("Error creating topic:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Topic already exists for this user" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const topics = await prisma.topic.findMany({
      where: { userId },
      include: {
        _count: {
          select: { studyCards: true },
        },
      },
    });

    return NextResponse.json({ success: true, topics });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
