/**
 * Loading skeleton shown while an events page is streaming its data.
 *
 * Every measurement mirrors the real component tree to eliminate layout
 * shift as the skeleton transitions to live content:
 *
 *  - NavigationBar   h-[60px]  bg-gray-100
 *  - H1 headline     mt-4 text-[16px] pl-2  /  md:text-[20px] md:mb-6
 *  - GenreNav        pt-1 pb-4, pills h-9 (px-4 py-2 text-sm = 36 px)
 *  - Card grid       grid-cols-1 gap-4 px-2.5 pt-4
 *                    md:grid-cols-2 md:gap-8 md:pt-10
 *                    xl:grid-cols-3
 *  - EventCard       image w-40 h-40 | text panel | separator | bottom
 *                    bottom: px-4 py-6 flex-col gap-3
 *                      date  leading-7 (28 px)
 *                      venue leading-4 (16 px)
 *                      pills mt-4, h-5 (px-3 py-1 text-xs = 20 px)
 *                    mobile card margins: mx-3 mb-6 / md:m-0
 */
export default function EventsLoading() {
  return (
    <>
      {/* ── Navigation bar ──────────────────────────────────────── */}
      <div className="h-[60px] w-full bg-gray-100 dark:bg-gray-900 animate-pulse">
        <div className="flex items-center justify-between h-full px-2.5">
          {/* Hamburger / Menu trigger: icon 27px + label text-xs */}
          <div className="flex flex-col items-center gap-1 p-2">
            <div className="w-7 h-7 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 w-10 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* Location trigger: min-w-[60px] h-[60px] MapPin 22px + label */}
          <div className="flex flex-col items-center gap-1 p-2 min-w-[60px]">
            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* UserGreeting: w-10, icon 24px + label text-xs */}
          <div className="flex flex-col items-center gap-1 p-2 w-10">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 w-8 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex flex-col md:p-5 md:flex-row-reverse max-w-[1440] m-auto animate-pulse">
        <section className="md:w-full md:pb-20">
          {/* H1 headline — mt-4 text-[16px] pl-2 / md:mb-6 md:text-[20px] */}
          <div className="mt-4 mb-4 md:mb-6 ml-2 h-4 md:h-5 w-64 md:w-80 rounded bg-gray-200 dark:bg-gray-700" />

          {/* GenreNav — pt-1 pb-4, pills: px-4 py-2 rounded-lg text-sm = h-9 (36px) */}
          <nav
            className="w-full bg-white dark:bg-gray-900 pt-1 pb-4"
            aria-hidden="true"
          >
            <div className="flex gap-2 overflow-hidden px-4">
              {(
                [
                  "w-12",
                  "w-36",
                  "w-16",
                  "w-20",
                  "w-24",
                  "w-16",
                  "w-20",
                ] as const
              ).map((width, i) => (
                <div
                  key={i}
                  /* h-9 = 36px matches py-2 + text-sm line-height */
                  className={`h-9 flex-shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 ${width}`}
                />
              ))}
            </div>
          </nav>

          {/* Event card grid
              mobile : grid-cols-1 gap-4 px-2.5 pt-4
              md     : grid-cols-2 gap-8 pt-10
              xl     : grid-cols-3                    */}
          <div className="grid grid-cols-1 gap-4 p-0 px-2.5 pb-10 pt-4 md:pt-10 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              /* Card wrapper — mirrors EventCard container classes exactly */
              <div
                key={i}
                className="relative text-left mx-3 mb-6 md:m-0 bg-white dark:bg-gray-800 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg shadow-md"
              >
                {/* ── Top section: image + text panel ── */}
                <div className="flex p-0">
                  {/* Artist image: w-40 h-40 = 160 × 160 px */}
                  <div className="w-40 h-40 flex-shrink-0 bg-gray-200 dark:bg-gray-700" />

                  {/* Text panel: p-2 pr-4 pl-4 flex flex-col justify-center gap-2 */}
                  <div className="flex-1 p-2 pr-4 pl-4 flex flex-col justify-center gap-2">
                    {/* Event name — text-sm ≈ 14 px / leading ≈ 20 px → h-3.5 */}
                    <div className="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    {/* Artist names — text-xl leading-tight ≈ 24 px → h-6 */}
                    <div className="h-6 w-full rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                    {/* Festival/Stream badge — text-xs ≈ 12 px → h-3 */}
                    <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>

                {/* Separator — border-t exactly as in EventCard */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* ── Bottom section: px-4 py-6 flex flex-col gap-3 ── */}
                <div className="px-4 py-6 flex flex-col gap-3">
                  {/* Date row — text-sm leading-7 (28 px) with icon */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* Venue row — text-sm leading-4 (16 px) with icon */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* EventPills — mt-4, pills: px-3 py-1 text-xs rounded-full = h-5 (20 px) */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="h-5 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
