import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/app/components/navigation/Pagination";

export interface PlayerLeaderboardPaginationProps {
  totalCount: number;
  pageSize: number;
  page: number;
  onChange: (newPage: number) => void;
  keyPrefix: string; // Add a keyPrefix prop to ensure uniqueness
}

const PlayerLeaderboardPagination: React.FC<PlayerLeaderboardPaginationProps> = ({
  totalCount,
  pageSize,
  page,
  onChange,
  keyPrefix, // Accept keyPrefix as a prop
}) => {
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
    const maxVisiblePages = 7;
    let pages = [];

    // If totalPages is less than or equal to maxVisiblePages, render all pages.
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages.map((p) => (
        <PaginationItem key={`${keyPrefix}-page-${p}`}>
          <PaginationLink
            href="#"
            className={`rounded-md aspect-square h-9 ${
              p === page ? "bg-accent text-primary font-extrabold" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onChange(p);
            }}
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    // Otherwise, handle the edge cases (first, middle, and last page sections).
    const startPage = Math.max(1, page - 1); // Starting page (up to 2 pages before current page)
    const endPage = Math.min(totalPages, page + 1); // Ending page (up to 2 pages after current page)

    if (page <= 4) {
      // First few pages
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (page >= totalPages - 3) {
      // Last few pages
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Middle pages
      pages.push(1);
      pages.push("ellipsis");
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages.map((p, idx) => {
      if (p === "ellipsis") {
        return (
          <PaginationItem key={`${keyPrefix}-ellipsis-${idx}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={`${keyPrefix}-page-${p}`}>
          <PaginationLink
            href="#"
            className={`rounded-md aspect-square h-9 ${
              p === page ? "bg-accent text-primary font-extrabold" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onChange(p);
            }}
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <Pagination className="h-full">
      <PaginationContent>{renderPagination()}</PaginationContent>
    </Pagination>
  );
};

export { PlayerLeaderboardPagination };
