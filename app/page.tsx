"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { TopicForm } from "@/components/TopicForm";
import { TopicItem } from "@/components/TopicItem";
import { LearningPlanPreview } from "@/components/LearningPlanPreview";
import { topicsAPI, cardsAPI } from "@/lib/api";

interface Topic {
  id: string;
  title: string;
  description?: string;
  _count?: {
    studyCards: number;
  };
}

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingCards, setGeneratingCards] = useState<string | null>(null);

  useEffect(() => {
    // Initialize user with a simple session
    const sessionUserId = localStorage.getItem("userId");
    if (!sessionUserId) {
      const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    } else {
      setUserId(sessionUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTopics();
    }
  }, [userId]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await topicsAPI.getAll(userId);
      if (response.data.success) {
        setTopics(response.data.topics);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      setLoading(true);
      const response = await topicsAPI.create({
        userId,
        ...data,
      });

      if (response.data.success) {
        const newTopic = response.data.topic;
        toast.success("Topic created! Generating study cards...");

        // Generate cards for the new topic
        setGeneratingCards(newTopic.id);
        try {
          await cardsAPI.generate({
            topicId: newTopic.id,
            userId,
          });
          toast.success("Study cards generated!");
        } catch (error) {
          toast.error("Failed to generate cards");
        } finally {
          setGeneratingCards(null);
        }

        // Refresh topics
        await fetchTopics();
      }
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Failed to create topic";
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Personalized Learning
          </h1>
          <p className="text-gray-600">
            Study smarter with AI-powered adaptive learning cards
          </p>
        </div>

        {/* Learning Plan Preview */}
        <LearningPlanPreview userId={userId} />

        {/* Topic Form */}
        <TopicForm onSubmit={handleCreateTopic} isLoading={loading} />

        {/* Topics List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Study Topics
          </h2>

          {topics.length === 0 ? (
            <div className="p-12 bg-white rounded-lg border-2 border-dashed border-gray-300 text-center">
              <p className="text-gray-500">
                No topics yet. Create one above to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div key={topic.id} className="relative">
                  <TopicItem
                    id={topic.id}
                    title={topic.title}
                    cardCount={topic._count?.studyCards || 0}
                  />
                  {generatingCards === topic.id && (
                    <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-600">
                        Generating cards...
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
