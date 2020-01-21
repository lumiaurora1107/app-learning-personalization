"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { learningPlanAPI } from "@/lib/api";

interface LearningPlanProps {
  userId: string;
  topicId?: string;
}

interface LearningPlanData {
  id: string;
  planDate: string;
  cardIds: string[];
  focusAreas: string[];
}

export function LearningPlanPreview({ userId, topicId }: LearningPlanProps) {
  const [plan, setPlan] = useState<LearningPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await learningPlanAPI.getTomorrow(userId, topicId);
        if (response.data.success) {
          setPlan(response.data.plan);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.error || "Failed to load learning plan"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [userId, topicId]);

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
        <p className="text-center text-gray-700">Loading your learning plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border-2 border-red-200">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        📅 Your Learning Plan for Tomorrow
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Cards to review:</span>{" "}
          {plan.cardIds.length}
        </p>
        {plan.focusAreas.length > 0 && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Focus areas:</span>{" "}
            {plan.focusAreas.join(", ")}
          </p>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Based on your feedback, the system has prepared{" "}
        {plan.cardIds.length} cards that need review tomorrow.
      </p>
    </div>
  );
}
