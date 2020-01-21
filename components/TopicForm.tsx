import React from "react";
import { useState } from "react";

interface TopicFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function TopicForm({ onSubmit, isLoading = false }: TopicFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Topic title is required");
      return;
    }

    try {
      await onSubmit({ title, description });
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "Failed to create topic");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg border-2 border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        What do you want to study?
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Topic Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., React Hooks, Spanish Verbs, Biology Photosynthesis"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any specific areas you want to focus on..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {isLoading ? "Creating..." : "Generate Study Cards"}
      </button>
    </form>
  );
}
