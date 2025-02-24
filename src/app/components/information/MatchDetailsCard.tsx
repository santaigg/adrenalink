import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlayerMatch,
  Match_Team,
  PlayerExtendedStats,
} from "@/app/utils/types/wavescan.types";
import { SponsorImage } from "../cosmetic/SponsorImageFromString";
import getSoloRankFromNumber, {
  getTeamRankFromNumber,
} from "@/app/utils/types/rank";
import { RankImage } from "../cosmetic/RankImageFromRank";
import { Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { match } from "assert";

const last_20_matches_avg_stats: PlayerExtendedStats = {
  total_kills: 450,
  total_assists: 75,
  total_deaths: 306,
  total_damage_dealt: 65292,
  total_wins: 16,
  total_losses: 4,
  total_draws: 0,
  total_rounds_played: 222,
  top_damage_dealt: 6624,
  top_kills: 52,
  top_assists: 9,
  top_deaths: 26,
  average_win_percentage: 80,
  average_damage_per_round: 294.1081081081081,
  average_kills_per_round: 2.027027027027027,
  average_assists_per_round: 0.33783783783783783,
  average_deaths_per_round: 1.3783783783783783,
};

const tabs = ["Scoreboard", "Statistics"];

function getScoreColor(score: number): string {
  if (score >= 300) return "teal-400";
  if (score >= 250) return "emerald-200";
  if (score >= 200) return "primary-foreground";
  if (score >= 150) return "rose-300";
  return "red-500";
}

interface StatisticRowProps extends React.HTMLAttributes<HTMLDivElement> {
  playerStat: number;
  stat: string;
  avgStat: number;
  positiveOutcome: "greater" | "less";
}

const StatisticRow = React.forwardRef<HTMLDivElement, StatisticRowProps>(
  ({ playerStat, stat, avgStat, positiveOutcome }, ref) => {
    const matchPositive =
      positiveOutcome == "greater"
        ? playerStat > avgStat
        : playerStat < avgStat;

    return (
      <div
        ref={ref}
        className="h-12 w-full flex items-center even:bg-primary justify-center"
      >
        <div
          className={`w-1/3 flex items-center justify-center ${
            matchPositive ? "text-green-400" : "text-primary-foreground"
          }`}
        >
          <p>{playerStat}</p>
        </div>
        <div className="w-1/3 flex items-center justify-between text-primary-foreground">
          <ChevronLeft
            className={`text-green-400 ${matchPositive ? "" : "opacity-0"}`}
            size={16}
          />
          <p>{stat}</p>
          <ChevronRight
            className={`text-yellow-400 ${matchPositive ? "opacity-0" : ""}`}
            size={16}
          />
        </div>
        <div
          className={`w-1/3 flex items-center justify-center ${
            matchPositive ? "text-primary-foreground" : "text-yellow-400"
          }`}
        >
          <p>{avgStat}</p>
        </div>
      </div>
    );
  }
);

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
            </div>
          ) : tab === "Statistics" ? (
            <div className="w-full rounded bg-secondary flex flex-col overflow-hidden">
              <div className="h-10 w-full flex items-center justify-center">
                <div className="w-1/3 flex items-center justify-center text-primary-foreground">
                  <p>This Match</p>
                </div>
                <div className="w-1/3 flex items-center justify-center text-primary-foreground">
                  <p>Statistic</p>
                </div>
                <div className="w-1/3 flex items-center justify-center text-primary-foreground">
                  <p>Last 20 Avg.</p>
                </div>
              </div>
              <StatisticRow
                playerStat={Number(
                  match.player_team.players
                    .find((player) => player.id === playerId)
                    ?.kills!.toFixed(2)
                )}
                stat="Kills"
                avgStat={Number(
                  (
                    last_20_matches_avg_stats.total_kills /
                    (last_20_matches_avg_stats.total_wins +
                      last_20_matches_avg_stats.total_draws +
                      last_20_matches_avg_stats.total_losses)
                  ).toFixed(2)
                )}
                positiveOutcome="greater"
              />
              <StatisticRow
                playerStat={Number(
                  match.player_team.players
                    .find((player) => player.id === playerId)
                    ?.assists!.toFixed(2)
                )}
                stat="Assists"
                avgStat={Number(
                  (
                    last_20_matches_avg_stats.total_assists /
                    (last_20_matches_avg_stats.total_wins +
                      last_20_matches_avg_stats.total_draws +
                      last_20_matches_avg_stats.total_losses)
                  ).toFixed(2)
                )}
                positiveOutcome="greater"
              />
              <StatisticRow
                playerStat={Number(
                  match.player_team.players
                    .find((player) => player.id === playerId)
                    ?.deaths!.toFixed(2)
                )}
                stat="Deaths"
                avgStat={Number(
                  (
                    last_20_matches_avg_stats.total_deaths /
                    (last_20_matches_avg_stats.total_wins +
                      last_20_matches_avg_stats.total_draws +
                      last_20_matches_avg_stats.total_losses)
                  ).toFixed(2)
                )}
                positiveOutcome="less"
              />
              <StatisticRow
                playerStat={Number(
                  match.player_team.players
                    .find((player) => player.id === playerId)
                    ?.damage_dealt!.toFixed(2)
                )}
                stat="Damage Dealt"
                avgStat={Number(
                  (
                    last_20_matches_avg_stats.total_damage_dealt /
                    (last_20_matches_avg_stats.total_wins +
                      last_20_matches_avg_stats.total_draws +
                      last_20_matches_avg_stats.total_losses)
                  ).toFixed(2)
                )}
                positiveOutcome="greater"
              />
              <StatisticRow
                playerStat={Number(
                  (
                    match.player_team.players.find(
                      (player) => player.id === playerId
                    )?.damage_dealt! / match.rounds
                  ).toFixed(2)
                )}
                stat="Damage Per Round"
                avgStat={Number(
                  last_20_matches_avg_stats.average_damage_per_round.toFixed(2)
                )}
                positiveOutcome="greater"
              />
              <StatisticRow
                playerStat={Number(
                  (
                    match.player_team.players.find(
                      (player) => player.id === playerId
                    )?.kills! / match.rounds
                  ).toFixed(2)
                )}
                stat="Kills Per Round"
                avgStat={Number(
                  last_20_matches_avg_stats.average_kills_per_round.toFixed(2)
                )}
                positiveOutcome="greater"
              />

              <StatisticRow
                playerStat={Number(
                  (
                    match.player_team.players.find(
                      (player) => player.id === playerId
                    )?.assists! / match.rounds
                  ).toFixed(2)
                )}
                stat="Assists Per Round"
                avgStat={Number(
                  last_20_matches_avg_stats.average_assists_per_round.toFixed(2)
                )}
                positiveOutcome="greater"
              />
              <StatisticRow
                playerStat={Number(
                  (
                    match.player_team.players.find(
                      (player) => player.id === playerId
                    )?.deaths! / match.rounds
                  ).toFixed(2)
                )}
                stat="Deaths Per Round"
                avgStat={Number(
                  last_20_matches_avg_stats.average_deaths_per_round.toFixed(2)
                )}
                positiveOutcome="less"
              />
            </div>
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
          <div className="flex space-x-2">
            {/* Maybe add ability to share matches through santai => Need match slug page for this */}
            <div
              className="group rounded w-full px-2 py-1 bg-secondary text-sm cursor-pointer flex justify-between items-center"
              onClick={() => copyMatchID()}
            >
              <p className="text-muted-foreground">
                Match ID:{" "}
                <span className="text-primary-foreground/75">{match.id}</span>
              </p>
              <Copy
                className={`text-primary-foreground group-hover:opacity-100 opacity-0 transition-all ${
                  idCopied ? "hidden" : ""
                }`}
                size={16}
              />
              <Check
                className={`text-accent transition-all ${
                  idCopied ? "" : "hidden"
                }`}
                size={16}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
MatchDetailsCard.displayName = "MatchDetailsCard";

export { MatchDetailsCard };
