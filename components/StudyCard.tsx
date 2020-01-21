import React from "react";

interface StudyCardProps {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty?: string;
  onFeedback: (status: string, rating?: number) => void;
  isFlipped?: boolean;
}

export function StudyCard({
  id,
  question,
  answer,
  explanation,
  difficulty,
  onFeedback,
  isFlipped = false,
}: StudyCardProps) {
  const [flipped, setFlipped] = React.useState(isFlipped);

  return (
    <div className="w-full mb-6">
      <div
        className={`min-h-64 p-6 rounded-lg border-2 border-gray-200 transition-all cursor-pointer ${
          flipped ? "bg-blue-50" : "bg-white"
        } hover:shadow-md`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="text-sm font-semibold text-gray-500 mb-2">
          {difficulty && `Difficulty: ${difficulty.toUpperCase()}`}
        </div>

        {!flipped ? (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Question
            </h3>
            <p className="text-lg text-gray-700">{question}</p>
            <p className="text-sm text-gray-400 mt-4">
              Click to reveal answer
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Answer</h3>
            <p className="text-lg text-gray-700 mb-4">{answer}</p>
            {explanation && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-300">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Explanation:</span>{" "}
                  {explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        <button
          onClick={() => onFeedback("incorrect")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          I got it wrong
        </button>
        <button
          onClick={() => onFeedback("needs_review")}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Need more practice
        </button>
        <button
          onClick={() => onFeedback("understood")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          I understood
        </button>
      </div>
    </div>
  );
}
