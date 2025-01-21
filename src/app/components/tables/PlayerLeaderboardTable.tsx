import { cn } from "@/app/utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/tables/Table";

import { RankImage } from "../cosmetic/RankImageFromRank";

interface PlayerRow {
  username: string;
  placement: number;
  soloRank: string;
  playerId: string;
  rating: number;
}

interface PlayerLeaderboardTableProps {
  playerRows: PlayerRow[];
  page: number;
  searchQuery: string;
  loading: boolean;
  updateTotalRows: Dispatch<SetStateAction<number>>;
}

const PlayerLeaderboardTable: React.FC<PlayerLeaderboardTableProps> = ({
  playerRows,
  page,
  searchQuery,
  loading,
  updateTotalRows,
}) => {
  const ENTRIES_PER_PAGE = 50;

  const router = useRouter();

  const handleRowClick = (playerId: string) => {
    router.push(`/p/${playerId}`);
  };

  const filteredRows = playerRows.filter((playerRow) => {
    return (
      searchQuery === "" ||
      playerRow.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  useEffect(() => {
    updateTotalRows(filteredRows.length);
  }, [filteredRows]);

  const paginatedRows = filteredRows.slice(
    (page - 1) * ENTRIES_PER_PAGE,
    page * ENTRIES_PER_PAGE
  );

  return (
    <>
      <Extrusion
        className={cn("min-w-36 border-secondary rounded-tl-primary")}
        cornerLocation={CornerLocation.TopRight}
      />
      <Table className="rounded-tr-primary overflow-hidden">
        <TableHeader className="bg-secondary h-20">
          <TableRow className="text-secondary-foreground border-b-[1px] border-muted">
            <TableHead>
              <h1 className="text-xl">#</h1>
            </TableHead>
            <TableHead>
              <h1 className="text-xl">Username</h1>
            </TableHead>
            <TableHead>
              <h1 className="text-xl">Rank</h1>
            </TableHead>
            <TableHead>
              <h1 className="text-xl">Rank Rating</h1>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: ENTRIES_PER_PAGE }).map((_, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer h-14 hover:bg-muted/25 border-secondary odd:bg-secondary even:bg-primary text-secondary-foreground"
                >
                  <TableCell>
                    <div className="w-8 h-4 bg-neutral-600 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-4 bg-neutral-600 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-4 bg-neutral-600 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="w-20 h-4 bg-neutral-600 animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            : paginatedRows.map((playerRow) => (
                <TableRow
                  key={playerRow.playerId}
                  className="cursor-pointer h-14 hover:bg-muted/25 border-secondary odd:bg-secondary even:bg-primary text-secondary-foreground"
                  onClick={() => handleRowClick(playerRow.playerId)}
                >
                  <TableCell>
                    <p className="text-lg">{playerRow.placement}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-lg">{playerRow.username}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-lg">{playerRow.soloRank}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-x-4">
                      <RankImage rank={playerRow.soloRank} />
                      <p className="text-lg mt-0.5">{playerRow.rating}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PlayerLeaderboardTable;
