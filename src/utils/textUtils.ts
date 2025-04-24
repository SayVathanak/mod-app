// utils/textUtils.ts

/**
 * Calculates the estimated reading time for a given text
 * @param text The text content to measure
 * @returns A string with the reading time format (e.g. "5 min read")
 */
export function calculateReadTime(text: string): string {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}