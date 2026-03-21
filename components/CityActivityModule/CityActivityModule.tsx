import CityActivityClient from "@/components/CityActivityModule/CityActivityClient";

/**
 * CityActivityModule
 *
 * Homepage section that presents an overview of the most active cities.
 * Each city card shows: shows, venues, artists, festivals, and series counts.
 * Cities are ranked from most active to least active using a weighted score.
 *
 * Data source:
 * City statistics are gathered passively — whenever an event page is loaded,
 * the processed events are stored in a server-side cache.  The homepage reads
 * from that cache via /api/city-stats.  No extra API calls are made on the
 * events page beyond what is already happening.
 *
 * @see docs/city-activity-module.md for full feature documentation.
 */
const CityActivityModule = () => {
  return (
    <section
      aria-labelledby="city-activity-heading"
      className="max-w-[1440] m-auto px-4 py-10"
    >
      <h2
        id="city-activity-heading"
        className="font-normal text-lg text-blue md:inline-block md:text-xl mb-2"
      >
        Most Active Cities
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Cities ranked by their overall electronic music scene activity — venues,
        artists, festivals, series, and upcoming shows.
      </p>

      <CityActivityClient />
    </section>
  );
};

export default CityActivityModule;
