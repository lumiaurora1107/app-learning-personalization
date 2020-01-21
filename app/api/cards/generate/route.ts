import { prisma } from "@/lib/prisma";
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topicId, userId } = await request.json();

    if (!topicId || !userId) {
      return NextResponse.json(
        { error: "topicId and userId are required" },
        { status: 400 }
      );
    }

    // Get topic information
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      return NextResponse.json(
        { error: "Topic not found" },
        { status: 404 }
      );
    }

    // Get existing study cards and feedback to understand what needs review
    const existingCards = await prisma.studyCard.findMany({
      where: { topicId, userId },
      include: {
        feedback: {
          where: { userId },
        },
      },
    });

    // Filter cards that need review (marked as incorrect or needs_review)
    const cardsThatNeedReview = existingCards.filter((card) => {
      const latestFeedback = card.feedback[card.feedback.length - 1];
      return (
        !latestFeedback ||
        latestFeedback.status === "needs_review" ||
        latestFeedback.status === "incorrect"
      );
    });

    // Generate prompt for OpenAI
    const contextInfo = cardsThatNeedReview.length > 0
      ? `User has previously struggled with: ${cardsThatNeedReview.map((c) => c.question).join(", ")}`
      : "";

    const message = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an educational content creator. Generate 5 study cards for the topic. Each card should have a question, answer, and explanation. Format your response as a JSON array with objects containing "question", "answer", and "explanation" fields. Make the content engaging and practical.`,
        },
        {
          role: "user",
          content: `Topic: ${topic.title}. Description: ${topic.description || "No description provided"}. ${contextInfo}. Generate educational study cards focusing on key concepts and areas where the user might struggle.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response from OpenAI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let generatedCards;
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }
      generatedCards = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse OpenAI response" },
        { status: 500 }
      );
    }

    // Save generated cards to database
    const savedCards = await Promise.all(
      generatedCards.map((card: any) =>
        prisma.studyCard.create({
          data: {
            question: card.question,
            answer: card.answer,
            explanation: card.explanation || "",
            difficulty: "medium",
            topicId,
            userId,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      cards: savedCards,
      cardsThatWereReviewed: cardsThatNeedReview.length,
    });
  } catch (error) {
    console.error("Error generating cards:", error);
    return NextResponse.json(
      { error: "Failed to generate study cards" },
      { status: 500 }
    );
  }
}
