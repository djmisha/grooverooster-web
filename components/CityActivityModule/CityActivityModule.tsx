import CityActivityClient from "./CityActivityClient";

/**
 * CityActivityModule — thin server-component wrapper that renders the
 * client-side city activity list.
 *
 * The underlying data is fetched client-side from /api/city-stats, which
 * returns cached event counts built up gradually as city pages are visited.
 * The browser caches the response for 24 hours.
 */
const CityActivityModule = () => <CityActivityClient />;

export default CityActivityModule;
