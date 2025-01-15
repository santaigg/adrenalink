import { cn } from "@/app/utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/tables/Table";

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
  const rows = playerRows.map((playerRow) => {
    if (
      playerRow.placement <= page * ENTRIES_PER_PAGE &&
      playerRow.placement > (page - 1) * ENTRIES_PER_PAGE
    ) {
      return (
        <TableRow
          key={playerRow.playerId}
          className="hover:bg-surface-7 hover:text-primary-5 hover:cursor-pointer bg-surface-8 border-b-surface-7"
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
            <p className="text-lg">{playerRow.rating}</p>
          </TableCell>
        </TableRow>
      );
    }
  });

  return (
    <>
      <Extrusion
        className={cn("min-w-24 border-surface-5")}
        cornerLocation={CornerLocation.TopRight}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <h1 className="text-xl sm:text-2xl font-normal">#</h1>
            </TableHead>
            <TableHead>
              <h1 className="text-xl sm:text-2xl font-normal">Username</h1>
            </TableHead>
            <TableHead>
              <h1 className="text-xl sm:text-2xl font-normal">Rank</h1>
            </TableHead>
            <TableHead>
              <h1 className="text-xl sm:text-2xl font-normal">Rank Rating</h1>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    </>
  );
};

export default PlayerLeaderboardTable;
