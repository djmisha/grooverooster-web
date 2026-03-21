/**
 * Scrolls the page to the top using anchor navigation.
 *
 * WHY THIS USES window.location.href = "#top" (the intentional "anti-pattern"):
 * ─────────────────────────────────────────────────────────────────────────────
 * The "clean" React/browser alternatives (window.scrollTo, element.scrollIntoView,
 * router scroll options) all trigger a visible reflow/repaint cycle AFTER the new
 * React state has been committed, causing the page to flash to the new content
 * first and then scroll up — producing noticeable jank and jumping on every
 * pagination click or filter change.
 *
 * Setting window.location.href to "#top" instead lets the browser handle the
 * scroll as part of its native hash-navigation pipeline, which runs synchronously
 * before the next paint. This eliminates the jumping entirely.
 *
 * The trade-off is that "#top" is appended to the URL in the browser history.
 * This is a known side-effect that was intentionally accepted because the UX
 * improvement (no jumping) far outweighs the cosmetic URL noise.
 *
 * ⚠️  DO NOT refactor this back to window.scrollTo() or scrollIntoView() without
 * first verifying that the jank/jumping issue no longer occurs. Prior attempts to
 * use "cleaner" scroll APIs reintroduced the jump on every page change.
 *
 */
export const scrollToPageTop = (): void => {
  window.location.href = "#top";
};
