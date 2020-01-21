/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "understood":
      return "bg-green-100 text-green-800";
    case "needs_review":
      return "bg-yellow-100 text-yellow-800";
    case "incorrect":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "hard":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

/**
 * Get status icon
 */
export function getStatusIcon(status: string): string {
  switch (status) {
    case "understood":
      return "✅";
    case "needs_review":
      return "📝";
    case "incorrect":
      return "❌";
    default:
      return "❓";
  }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number = 50): string {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
