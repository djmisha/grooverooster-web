import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * @param {...ClassValue} inputs - Class values to merge (strings, arrays, objects)
 * @returns {string} Merged and deduplicated class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
