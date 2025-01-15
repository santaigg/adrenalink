import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/shadcn/Pagination";

export interface PlayerLeaderboardPaginationProps {
  totalCount: number;
  pageSize: number;
  page: number;
  onChange: (newPage: number) => void;
}
const PlayerLeaderboardPagination: React.FC<
  PlayerLeaderboardPaginationProps
> = ({ totalCount, pageSize, page, onChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleNext = () => {
    if (page < totalPages) {
      onChange(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      onChange(page - 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Elipsis && First Page */}
        {page > 2 && (
          <>
            <PaginationItem
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                onChange(1);
              }}
            >
              <PaginationLink href="#">{1}</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {/* Hide prev page on page 1 */}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                handlePrevious();
              }}
            >
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current page */}
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {page}
          </PaginationLink>
        </PaginationItem>

        {/* Next Page */}
        {(page < totalPages - 2 || page == totalPages - 1) && (
          <PaginationItem
            onClick={(e) => {
              e.preventDefault(); // Prevent the default link behavior
              handleNext();
            }}
          >
            <PaginationLink href="#">{page + 1}</PaginationLink>
          </PaginationItem>
        )}

        {/* Elipsis && Final Page */}
        {page < totalPages - 1 && (
          <>
            {page == totalPages - 2 ? (
              <PaginationItem
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default link behavior
                  onChange(totalPages - 1);
                }}
              >
                <PaginationLink href="#">{totalPages - 1}</PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                onChange(totalPages);
              }}
            >
              <PaginationLink href="#">{totalPages}</PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export { PlayerLeaderboardPagination };
