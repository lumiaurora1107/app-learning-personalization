"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { StudyCard } from "@/components/StudyCard";
import { cardsAPI, feedbackAPI, learningPlanAPI } from "@/lib/api";

interface Card {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty?: string;
  feedback?: Array<{
    status: string;
  }>;
}

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [userId, setUserId] = useState<string>("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    const sessionUserId = localStorage.getItem("userId");
    if (sessionUserId) {
      setUserId(sessionUserId);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (userId && topicId) {
      fetchCards();
    }
  }, [userId, topicId]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await cardsAPI.getByTopic(topicId, userId);
      if (response.data.success) {
        setCards(response.data.cards);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      toast.error("Failed to load study cards");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (
    cardId: string,
    status: string,
    rating?: number
  ) => {
    try {
      await feedbackAPI.submit({
        cardId,
        userId,
        status,
        rating,
      });

      setFeedback((prev) => ({
        ...prev,
        [cardId]: status,
      }));

      const statusMessage =
        status === "understood"
          ? "Great! Keep it up! 🎉"
          : status === "needs_review"
            ? "Added to review list 📝"
            : "Noted, we'll practice this more 💪";

      toast.success(statusMessage);
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  const handleGenerateMore = async () => {
    try {
      setGeneratingMore(true);
      // Call the generate cards API
      const response = await cardsAPI.generate({
        topicId,
        userId,
      });

      if (response.data.success) {
        toast.success("New study cards generated!");
        await fetchCards(); // Refresh the cards
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to generate more cards"
      );
    } finally {
      setGeneratingMore(false);
    }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading study cards...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-blue-600 hover:underline mb-4">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">Study Cards</h1>
          </div>
        </div>

        {/* Study Info */}
        <div className="mb-8 p-4 bg-white rounded-lg border-2 border-gray-200">
          <p className="text-gray-600">
            <span className="font-semibold">Total cards:</span> {cards.length}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Progress status:</span>{" "}
            {Object.keys(feedback).length} reviewed
          </p>
        </div>

        {/* Study Cards */}
        <div className="mb-8">
          {cards.length === 0 ? (
            <div className="p-12 bg-white rounded-lg border-2 border-dashed border-gray-300 text-center">
              <p className="text-gray-500 mb-4">
                No study cards yet. Generate some to begin!
              </p>
              <button
                onClick={handleGenerateMore}
                disabled={generatingMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {generatingMore ? "Generating..." : "Generate Study Cards"}
              </button>
            </div>
          ) : (
            <>
              {cards.map((card) => (
                <StudyCard
                  key={card.id}
                  id={card.id}
                  question={card.question}
                  answer={card.answer}
                  explanation={card.explanation}
                  difficulty={card.difficulty}
                  onFeedback={(status) =>
                    handleFeedback(card.id, status)
                  }
                />
              ))}
            </>
          )}
        </div>

        {/* Generate More Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleGenerateMore}
            disabled={generatingMore}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            {generatingMore ? "Generating..." : "Generate More Cards"}
          </button>
        </div>
      </div>
    </div>
  );
}
