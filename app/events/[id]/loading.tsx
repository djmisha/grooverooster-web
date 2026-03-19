/**
 * Loading skeleton shown while an events page is streaming its data.
 * Matches the approximate shape of the EventsModule layout so the
 * transition from skeleton → content feels seamless.
 */
export default function EventsLoading() {
  return (
    <div
      className="flex flex-col md:p-5 md:flex-row-reverse max-w-[1440px] m-auto animate-pulse"
      aria-label="Loading events…"
    >
      <section className="md:w-full md:pb-20">
        {/* Page headline placeholder */}
        <div className="mt-4 mb-6 h-5 w-48 rounded bg-gray-200 dark:bg-gray-700 pl-2" />

        {/* Genre pill row placeholder */}
        <div className="flex gap-2 overflow-hidden px-2.5 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>

        {/* Event card grid placeholder */}
        <div className="grid grid-cols-1 gap-4 px-2.5 pb-10 pt-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
