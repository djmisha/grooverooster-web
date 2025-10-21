import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML content to prevent XSS (Cross-Site Scripting) attacks.
 *
 * This utility uses DOMPurify to remove potentially malicious HTML content
 * while preserving safe formatting tags. It's designed to work in both
 * browser and Node.js environments (via isomorphic-dompurify).
 *
 * Use this function before rendering any untrusted HTML content via
 * dangerouslySetInnerHTML or similar mechanisms.
 *
 * @param {string} dirty - Unsanitized HTML content from untrusted sources
 * @returns {string} Sanitized HTML content safe for rendering
 *
 * @example
 * ```typescript
 * import { sanitizeHtml } from '@/utils/sanitizeHtml';
 *
 * const userContent = '<p>Hello</p><script>alert("xss")</script>';
 * const safe = sanitizeHtml(userContent); // Returns: '<p>Hello</p>'
 * ```
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return "";

  // Configure DOMPurify to allow only safe tags and attributes
  // This whitelist approach ensures that only known-safe elements are rendered
  const config = {
    ALLOWED_TAGS: [
      "p", // Paragraphs
      "br", // Line breaks
      "b", // Bold (legacy)
      "i", // Italic (legacy)
      "em", // Emphasis (italic)
      "strong", // Strong emphasis (bold)
      "u", // Underline
      "span", // Inline container
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6", // Headings
      "ul", // Unordered lists
      "ol", // Ordered lists
      "li", // List items
      "blockquote", // Block quotes
    ],
    ALLOWED_ATTR: ["class"], // Only allow class attributes for styling
    KEEP_CONTENT: true, // Keep text content even if tags are removed
  };

  return DOMPurify.sanitize(dirty, config);
};
