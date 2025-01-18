import { cn } from "@/app/utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { useRouter } from "next/navigation";

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
}

const PlayerLeaderboardTable: React.FC<PlayerLeaderboardTableProps> = ({
  playerRows,
  page,
}) => {
  const ENTRIES_PER_PAGE = 50;

  const router = useRouter();

  const handleRowClick = (playerId: string) => {
    router.push(`/p/${playerId}`);
  };

  const rows = playerRows.map((playerRow) => {
    if (
      playerRow.placement <= page * ENTRIES_PER_PAGE &&
      playerRow.placement > (page - 1) * ENTRIES_PER_PAGE
    ) {
      return (
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
      );
    }
  });

  return (
    <>
      <Extrusion
        className={cn("min-w-36 border-secondary rounded-tl")}
        cornerLocation={CornerLocation.TopRight}
      />
      <Table className="rounded-tr overflow-hidden">
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
        <TableBody>{rows}</TableBody>
      </Table>
    </>
  );
};

export default PlayerLeaderboardTable;
