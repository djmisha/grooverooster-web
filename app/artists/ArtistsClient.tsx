"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Layout from "@/components/layout";
import { filterSurpriseGuest } from "@/utils/utilities";
import NavigationBar from "@/components/Navigation/NavigataionBar";
import TopArtistsCard from "@/components/TopArtistsCard/TopArtistsCard";
import ArtistSearchAutocomplete from "@/components/SearchAutoComplete/ArtistSearchAutocomplete";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getCanonicalUrl } from "@/utils/canonicalUrl";

const Artists = ({ uniqueArtists }: { uniqueArtists: any[] }) => {
  const baseArtists = filterSurpriseGuest(uniqueArtists);
  const apiEvents = baseArtists.slice(0, 30);
  const hasFetched = useRef(false);
  const canonicalUrl = getCanonicalUrl("/artists");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Filter artists based on search term
  const filteredArtists = useMemo(() => {
    if (searchTerm.trim() === "") {
      return baseArtists;
    }
    return baseArtists.filter((artist) =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [baseArtists, searchTerm]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const totalItems = filteredArtists.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate current items to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtists = filteredArtists.slice(startIndex, endIndex);

  // Handle search change
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!hasFetched.current && apiEvents) {
      async function postData() {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/supabase/posttopartists`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(apiEvents),
            }
          );
        } catch (error) {
          console.error("Fetch failed: ", error);
        }
      }

      postData();
      hasFetched.current = true;
    }
  }, [apiEvents]);

  return (
    <Layout home={false} canonicalUrl={canonicalUrl}>
      <>
        <NavigationBar setSearchTerm={() => {}} locationData={[]} />
        <div className="text-center my-6">
          <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px]">
            Top Touring Artists
          </h1>
        </div>

        {/* Artist Search Component */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <ArtistSearchAutocomplete
              artists={baseArtists}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 md:gap-6">
          {currentArtists?.map((artist: any) => (
            <TopArtistsCard key={artist.id} artist={artist} />
          ))}
        </div>

        {/* Artist count moved to bottom */}
        <div className="text-center py-6">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} artists (Page {currentPage} of {totalPages})
          </p>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 mb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return page >= currentPage - 2 && page <= currentPage + 2;
                  })
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    </Layout>
  );
};

export default Artists;
