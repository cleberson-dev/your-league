import cls from "classnames";
import { Tooltip } from "react-tooltip";
import { Team, Game, Result } from "~/entities/League.entity";
import TeamLogo from "./team-logo";

type TeamFormBulletsProps = {
  team: Team;
  results: (Game & { result: Result })[];
  leagueTeams: Team[];
};

const className = {
  container: "flex items-center justify-center gap-x-1",
  bullet: (result: Result) =>
    cls({
      "h-2 w-2 rounded-full": true,
      "bg-green": result === "WIN",
      "bg-slate-300 dark:bg-slate-600": result === "DRAW",
      "bg-red": result === "LOSS",
    }),
  tooltipTitle: "mb-2",
  scoreTeam: (isTheUnderlyingTeam: boolean, result: Result) =>
    isTheUnderlyingTeam
      ? cls({
        "font-bold": true,
        "text-green": result === "WIN",
        "text-red": result === "LOSS",
      })
      : "",
  teamLogo: "h-4 w-4",
  resultListItem:
    "grid grid-cols-[1fr_1rem_3rem_1rem_1fr] items-center gap-x-2 text-center",
};

export default function TeamFormBullets({
  results,
  team,
  leagueTeams,
}: TeamFormBulletsProps) {
  return (
    <div
      className={className.container}
      data-tooltip-id={"team-form-" + team.id}
    >
      {results.map((result, idx) => (
        <div key={idx} className={className.bullet(result.result)} />
      ))}
      <Tooltip id={"team-form-" + team.id}>
        <h1 className={className.tooltipTitle}>{team.name}&apos;s Results</h1>
        <ul>
          {results.map((result, idx) => (
            <li key={idx} className={className.resultListItem}>
              <span
                className={className.scoreTeam(
                  team.id === leagueTeams[result.homeTeam!].id,
                  result.result
                )}
              >
                {leagueTeams[result.homeTeam!].name}
              </span>
              <TeamLogo
                className={className.teamLogo}
                team={leagueTeams[result.homeTeam!]}
              />
              <span>
                {result.homeScore} x {result.awayScore}
              </span>
              <TeamLogo
                className={className.teamLogo}
                team={leagueTeams[result.awayTeam!]}
              />
              <span
                className={className.scoreTeam(
                  team.id === leagueTeams[result.awayTeam!].id,
                  result.result
                )}
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
