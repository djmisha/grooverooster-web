import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} dirty - Unsanitized HTML content
 * @returns {string} Sanitized HTML content safe for rendering
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return "";
  
  // Configure DOMPurify to allow only safe tags and attributes
  const config = {
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "em", "strong", "u", "span", 
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote"
    ],
    ALLOWED_ATTR: ["class"],
    KEEP_CONTENT: true,
  };
  
  return DOMPurify.sanitize(dirty, config);
};
