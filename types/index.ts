export type StudyCardStatus = "understood" | "needs_review" | "incorrect";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface StudyCard {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty: DifficultyLevel;
  topicId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardFeedback {
  id: string;
  cardId: string;
  userId: string;
  status: StudyCardStatus;
  rating?: number;
  notes?: string;
  reviewedAt: Date;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningPlan {
  id: string;
  userId: string;
  topicId: string;
  planDate: Date;
  cardIds: string[];
  focusAreas: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
