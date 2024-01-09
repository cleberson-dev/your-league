import cls from "classnames";
import { Tooltip } from "react-tooltip";
import { Team, Game } from "~/entities/League.entity";
import TeamLogo from "./team-logo";

type TeamFormBulletsProps = {
  team: Team;
  results: (Game & { result: "WIN" | "LOSS" | "DRAW" })[];
  leagueTeams: Team[];
};

export default function TeamFormBullets({
  results,
  team,
  leagueTeams,
}: TeamFormBulletsProps) {
  return (
    <div
      className="flex items-center justify-center gap-x-1"
      data-tooltip-id={"team-form-" + team.id}
    >
      {results.map((result, idx) => (
        <div
          key={idx}
          className={cls({
            "h-2 w-2 rounded-full": true,
            "bg-green": result.result === "WIN",
            "bg-slate-300 dark:bg-slate-600": result.result === "DRAW",
            "bg-red": result.result === "LOSS",
          })}
        />
      ))}
      <Tooltip id={"team-form-" + team.id}>
        <h1 className="mb-2">{team.name}&apos;s Results</h1>
        <ul>
          {results.map((result, idx) => (
            <li
              key={idx}
              className="grid grid-cols-[1fr_1rem_3rem_1rem_1fr] items-center gap-x-2 text-center"
            >
              <span
                className={cls({
                  "font-bold": team.id === leagueTeams[result.homeTeam!].id,
                  "text-green":
                    team.id === leagueTeams[result.homeTeam!].id &&
                    result.result === "WIN",
                  "text-red":
                    team.id === leagueTeams[result.homeTeam!].id &&
                    result.result === "LOSS",
                })}
              >
                {leagueTeams[result.homeTeam!].name}
              </span>
              <TeamLogo
                className="h-4 w-4"
                team={leagueTeams[result.homeTeam!]}
              />
              <span>
                {result.homeScore} x {result.awayScore}
              </span>
              <TeamLogo
                className="h-4 w-4"
                team={leagueTeams[result.awayTeam!]}
              />
              <span
                className={cls({
                  "font-bold": team.id === leagueTeams[result.awayTeam!].id,
                  "text-green":
                    team.id === leagueTeams[result.awayTeam!].id &&
                    result.result === "WIN",
                  "text-red":
                    team.id === leagueTeams[result.awayTeam!].id &&
                    result.result === "LOSS",
                })}
              >
                {leagueTeams[result.awayTeam!].name}
              </span>
            </li>
          ))}
        </ul>
      </Tooltip>
    </div>
  );
}
