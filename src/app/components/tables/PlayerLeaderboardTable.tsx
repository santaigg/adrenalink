import { Table } from "@mantine/core";
import { cn } from "@/app/utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";

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
        <Table.Tr
          key={playerRow.playerId}
          className="hover:bg-surface-7 hover:text-primary-5 hover:cursor-pointer bg-surface-8 border-b-surface-7"
        >
          <Table.Td>
            <p className="text-lg">{playerRow.placement}</p>
          </Table.Td>
          <Table.Td>
            <p className="text-lg">{playerRow.username}</p>
          </Table.Td>
          <Table.Td>
            <p className="text-lg">{playerRow.soloRank}</p>
          </Table.Td>
          <Table.Td>
            <p className="text-lg">{playerRow.rating}</p>
          </Table.Td>
        </Table.Tr>
      );
    }
  });

  return (
    <>
      <Extrusion
        className={cn("min-w-24 border-surface-5")}
        cornerLocation={CornerLocation.TopRight}
      />
      <Table
        stickyHeader
        stickyHeaderOffset={5}
        verticalSpacing="sm"
        styles={{
          table: { color: "white" },
        }}
        highlightOnHover
      >
        <Table.Thead className="bg-surface-5">
          <Table.Tr>
            <Table.Th>
              <h1 className="text-xl sm:text-2xl font-normal">#</h1>
            </Table.Th>
            <Table.Th>
              <h1 className="text-xl sm:text-2xl font-normal">Username</h1>
            </Table.Th>
            <Table.Th>
              <h1 className="text-xl sm:text-2xl font-normal">Rank</h1>
            </Table.Th>
            <Table.Th>
              <h1 className="text-xl sm:text-2xl font-normal">Rank Rating</h1>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};

export default PlayerLeaderboardTable;
