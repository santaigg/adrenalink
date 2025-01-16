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

  const renderPagination = () => {
    // Start edge cases
    if (page <= 4) {
      return (
        <>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == 1 ? "bg-accent text-primary font-extrabold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == 2 ? "bg-accent text-primary font-extrabold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(2);
              }}
            >
              2
            </PaginationLink>
          </PaginationItem>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == 3 ? "bg-accent text-primary font-extrabold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(3);
              }}
            >
              3
            </PaginationLink>
          </PaginationItem>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == 4 ? "bg-accent text-primary font-extrabold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(4);
              }}
            >
              4
            </PaginationLink>
          </PaginationItem>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == 5 ? "bg-accent text-primary font-extrabold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(5);
              }}
            >
              5
            </PaginationLink>
          </PaginationItem>
          {/* Elipsis && Final Page */}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem
            onClick={(e) => {
              e.preventDefault();
              onChange(totalPages);
            }}
          >
            <PaginationLink href="#">{totalPages}</PaginationLink>
          </PaginationItem>
        </>
      );
    }

    // Base case
    if (page > 4 && page < totalPages - 3) {
      return (
        <>
          {/* Elipsis && First Page */}
          <PaginationItem
            onClick={(e) => {
              e.preventDefault();
              onChange(1);
            }}
          >
            <PaginationLink href="#">{1}</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          {/* Hide prev page on page 1 */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
            >
              {page - 1}
            </PaginationLink>
          </PaginationItem>

          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive
              className="bg-accent text-primary font-extrabold"
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {/* Next Page */}
          <PaginationItem
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            <PaginationLink href="#">{page + 1}</PaginationLink>
          </PaginationItem>

          {/* Elipsis && Final Page */}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem
            onClick={(e) => {
              e.preventDefault();
              onChange(totalPages);
            }}
          >
            <PaginationLink href="#">{totalPages}</PaginationLink>
          </PaginationItem>
        </>
      );
    }

    // End edge Cases
    if (page >= totalPages - 3) {
      return (
        <>
          {/* First page && Elepsis */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onChange(1);
              }}
            >
              {1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == totalPages - 4
                  ? "bg-accent text-primary font-extrabold"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(totalPages - 4);
              }}
            >
              {totalPages - 4}
            </PaginationLink>
          </PaginationItem>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == totalPages - 3
                  ? "bg-accent text-primary font-extrabold"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(totalPages - 3);
              }}
            >
              {totalPages - 3}
            </PaginationLink>
          </PaginationItem>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == totalPages - 2
                  ? "bg-accent text-primary font-extrabold"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(totalPages - 2);
              }}
            >
              {totalPages - 2}
            </PaginationLink>
          </PaginationItem>
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == totalPages - 1
                  ? "bg-accent text-primary font-extrabold"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(totalPages - 1);
              }}
            >
              {totalPages - 1}
            </PaginationLink>
          </PaginationItem>
          {/* Final Page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              className={`${
                page == totalPages
                  ? "bg-accent text-primary font-extrabold"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </>
      );
    }
  };

  return (
    <Pagination className="h-full">
      <PaginationContent>{renderPagination()}</PaginationContent>
    </Pagination>
  );
};

export { PlayerLeaderboardPagination };
