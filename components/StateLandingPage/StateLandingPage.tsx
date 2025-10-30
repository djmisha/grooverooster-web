"use client";

import Link from "next/link";
import { makePageHeadline } from "../../utils/utilities";
import NavigationBar from "../Navigation/NavigataionBar";
import { Location } from "@/types";

interface City {
  id: string | number;
  name: string;
  state: string;
  slug: string;
}

interface StateLandingPageProps {
  stateName: string;
  cities: City[];
  locationData: Location[];
}

const StateLandingPage = ({
  stateName,
  cities,
  locationData,
}: StateLandingPageProps) => {
  const title = makePageHeadline(undefined, stateName);

  return (
    <>
      <NavigationBar setSearchTerm={() => {}} locationData={locationData} />
      <div className="flex flex-col md:p-5 md:flex-row-reverse" id="top">
        <section className="md:w-full md:pb-20 [&_h1]:border-none [&_h1]:text-center [&_h1]:pb-2.5 [&_h1]:leading-tight">
          <h1
            className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px]"
            id="top"
          >
            {title}
          </h1>

          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8 text-center">
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover electronic dance music events in cities throughout{" "}
                {stateName}. Select a city below to find nightclub DJ events,
                EDM concerts, and live music experiences.
              </p>
            </div>

            {cities && cities.length > 0 ? (
              <div>
                <h2 className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-800">
                  Cities in {stateName} ({cities.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {cities.map((city) => (
                    <Link
                      key={city.id}
                      href={`/events/${city.slug}`}
                      className="block p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 transform hover:-translate-y-1 text-center"
                    >
                      <h3 className="font-normal mt-10 text-lg text-blue md:inline-block text-lg font-semibold text-gray-900 mb-1 mt-0">
                        {city.name}
                      </h3>
                      <p className="text-sm text-gray-500">{city.state}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-lg text-gray-600 mb-4">
                    No cities available for {stateName} at this time.
                  </p>
                  <p className="text-sm text-gray-500">
                    Check back later for updates or explore other states.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-16 text-center">
              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                ← Browse All Locations
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StateLandingPage;
