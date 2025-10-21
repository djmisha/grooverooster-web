/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Server-safe implementation for Next.js App Router.
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return "";

  const allowedTags = [
    "p",
    "br",
    "b",
    "i",
    "em",
    "strong",
    "u",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
  ];

  let clean = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "");

  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  clean = clean.replace(tagPattern, (match, tag) => {
    return allowedTags.includes(tag.toLowerCase()) ? match : "";
  });

  return clean;
};
