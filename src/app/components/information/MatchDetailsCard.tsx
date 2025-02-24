import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlayerMatch, Match_Team } from "@/app/utils/types/wavescan.types";
import { SponsorImage } from "../cosmetic/SponsorImageFromString";
import getSoloRankFromNumber, {
  getTeamRankFromNumber,
} from "@/app/utils/types/rank";
import { RankImage } from "../cosmetic/RankImageFromRank";

const tabs = ["Scoreboard", "Statistics"];

function getScoreColor(score: number): string {
  if (score >= 300) return "teal-400";
  if (score >= 250) return "emerald-200";
  if (score >= 200) return "primary-foreground";
  if (score >= 150) return "rose-300";
  return "red-500";
}

interface MatchDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  match: PlayerMatch;
  playerId: string;
}

const MatchDetailsCard = React.forwardRef<HTMLDivElement, MatchDetailsProps>(
  ({ open, match, playerId }, ref) => {
    const [tab, setTab] = useState<string>("Scoreboard");
    const teams = [match.player_team, match.opponent_team];

    const router = useRouter();

    const handleRowClick = (playerId: string) => {
      router.push(`/p/${playerId}`);
    };

    const [idCopied, setIdCopied] = useState<boolean>(false);
    const copyMatchID = () => {
      navigator.clipboard.writeText(match.id);
      setIdCopied(true);
    };

    useEffect(() => {
      if (idCopied) {
        setTimeout(() => {
          setIdCopied(false);
        }, 2000);
      }
    }, [idCopied]);

    return (
      <div
        ref={ref}
        className={`flex items-start justify-start transition-[height] ${
          open ? "" : "h-0 hidden"
        }`}
      >
        <div className="w-full rounded bg-input border border-secondary p-2 flex flex-col space-y-2">
          <div className="flex rounded border-secondary border w-full">
            {tabs.map((tabName) => {
              return (
                <div
                  key={tabName}
                  className={`w-full [&:not(:first-child)]:border-l border-secondary flex justify-center items-center py-1 cursor-pointer transition-all hover:bg-muted/25 hover:text-secondary-foreground ${
                    tab === tabName
                      ? "bg-input-foreground/5 text-secondary-foreground"
                      : ""
                  }`}
                  onClick={() => setTab(tabName)}
                >
                  <p>{tabName}</p>
                </div>
              );
            })}
          </div>
          {tab === "Scoreboard" ? (
            <div className="w-full rounded overflow-hidden">
              {teams.map((team, teamIndex) => (
                <div key={teamIndex} className="w-full">
                  <div className="w-full flex bg-secondary p-2">
                    <div className="w-full text-left sm:w-1/3">
                      <p
                        className={` ${
                          teamIndex === 0 ? "text-green-400" : "text-red-500"
                        }`}
                      >
                        {teamIndex === 0 ? "My Team" : "Opponent Team"}
                      </p>
                    </div>
                    <div className="w-full sm:w-2/3 text-center flex items-center">
                      <div className="w-1/4 text-xs sm:text-sm">
                        <p>ADR</p>
                      </div>
                      <div className="w-1/4 text-xs sm:text-sm">
                        <p>KDA</p>
                      </div>
                      <div className="w-1/4 text-xs sm:text-sm">
                        <p>Damage</p>
                      </div>
                      <div className="w-1/4 text-xs sm:text-sm">
                        <p>KPR</p>
                      </div>
                    </div>
                  </div>
                  {team?.players.map((player) => {
                    return (
                      <div
                        key={player.id}
                        onClick={() => handleRowClick(player.id)}
                        className={`p-2 flex w-full items-center hover:bg-muted/25 odd:bg-secondary even:bg-primary cursor-pointer ${
                          player.id === playerId
                            ? "bg-gradient-to-r from-amber-700/10"
                            : ""
                        }`}
                      >
                        <div className="w-1/3 flex items-center gap-x-2">
                          <SponsorImage
                            className="w-8 h-auto"
                            sponsor={player.sponsor_name}
                          />
                          <RankImage
                            solo_rank={!team.used_team_rank}
                            rank={
                              team.used_team_rank
                                ? getTeamRankFromNumber(Number(player.rank_id))
                                : getSoloRankFromNumber(Number(player.rank_id))
                            }
                          />
                          <p className="">{player.name}</p>
                        </div>
                        <div className="w-2/3 flex items-center text-center">
                          <div
                            className={`w-1/4 text-xs sm:text-sm text-${getScoreColor(
                              Math.round(player.damage_dealt / match.rounds)
                            )}`}
                          >
                            <p>
                              {Math.round(player.damage_dealt / match.rounds)}
                            </p>
                          </div>
                          <div className="w-1/4 text-xs sm:text-sm">
                            <p>{`${player.kills} / ${player.deaths} / ${player.assists}`}</p>
                          </div>
                          <div className="w-1/4 text-xs sm:text-sm">
                            <p>{player.damage_dealt}</p>
                          </div>
                          <div className="w-1/4 text-xs sm:text-sm">
                            <p>{(player.kills / match.rounds).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div
                className="rounded w-full px-2 py-1 bg-secondary mt-2 text-sm cursor-pointer flex justify-between items-center"
                onClick={() => copyMatchID()}
              >
                <p>
                  Match ID: <span className="text-accent">{match.id}</span>
                </p>
                <p className={`text-accent ${idCopied ? "" : "hidden"}`}>
                  Match ID Copied!
                </p>
              </div>
            </div>
          ) : tab === "Statistics" ? (
            <div>Unfinished.</div>
          ) : (
            // component so tailwind builds the text styles for getScoreColor function :D
            <div className="hidden">
              <p className="text-teal-400"></p>
              <p className="text-emerald-200"></p>
              <p className="text-primary-foreground"></p>
              <p className="text-rose-300"></p>
              <p className="text-red-500"></p>
            </div>
          )}
        </div>
      </div>
    );
  }
);
MatchDetailsCard.displayName = "MatchDetailsCard";

export { MatchDetailsCard };
