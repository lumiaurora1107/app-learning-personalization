import React from "react";
import Link from "next/link";

interface TopicItemProps {
  id: string;
  title: string;
  cardCount?: number;
}

export function TopicItem({ id, title, cardCount = 0 }: TopicItemProps) {
  return (
    <Link href={`/study/${id}`}>
      <div className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">
          {cardCount} study card{cardCount !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
