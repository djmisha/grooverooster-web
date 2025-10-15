"use client";

import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import { filterSurpriseGuest } from "../../utils/utilities";
import NavigationBar from "../../components/Navigation/NavigataionBar";
import TopArtistsCard from "../../components/TopArtistsCard/TopArtistsCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../components/ui/pagination";
import { getCanonicalUrl } from "../../utils/canonicalUrl";

const title = "Top Touring EDM DJ's & Artists";

const Artists = ({ uniqueArtists }: { uniqueArtists: any[] }) => {
  const filteredArtists = filterSurpriseGuest(uniqueArtists);
  const apiEvents = filteredArtists.slice(0, 30);
  const hasFetched = useRef(false);
  const canonicalUrl = getCanonicalUrl('/artists');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const totalItems = filteredArtists.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate current items to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtists = filteredArtists.slice(startIndex, endIndex);

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
    <Layout canonicalUrl={canonicalUrl}>
      <>
        <div className="text-center my-6">
          <h1>Top Touring Artists</h1>
          <p className="text-gray-600 mt-2">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} artists (Page {currentPage} of {totalPages})
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 md:gap-6">
          {currentArtists?.map((artist: any) => (
            <TopArtistsCard key={artist.id} artist={artist} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 mb-6">
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
      <NavigationBar />
    </Layout>
  );
};

export default Artists;
