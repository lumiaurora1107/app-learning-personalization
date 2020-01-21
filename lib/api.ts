import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const topicsAPI = {
  create: (data: { userId: string; title: string; description?: string }) =>
    api.post("/api/topics", data),
  getAll: (userId: string) => api.get("/api/topics", { params: { userId } }),
};

export const cardsAPI = {
  generate: (data: { topicId: string; userId: string }) =>
    api.post("/api/cards/generate", data),
  getByTopic: (topicId: string, userId: string) =>
    api.get("/api/cards", { params: { topicId, userId } }),
};

export const feedbackAPI = {
  submit: (data: {
    cardId: string;
    userId: string;
    status: string;
    rating?: number;
    notes?: string;
  }) => api.post("/api/feedback/submit", data),
};

export const learningPlanAPI = {
  getTomorrow: (userId: string, topicId?: string) =>
    api.get("/api/learning-plan", { params: { userId, topicId } }),
};
