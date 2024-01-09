import cls from "classnames";
import { Tooltip } from "react-tooltip";
import { Team, Game } from "~/entities/League.entity";

type TeamFormBulletsProps = {
  team: Team;
  results: Game[];
  leagueTeams: Team[];
};

const getTeamResult = (team: Team, game: Game, leagueTeams: Team[]) => {
  const isHome = team.id === leagueTeams[game.homeTeam!].id;

  if (isHome) {
    if (game.homeScore! > game.awayScore!) return "WIN";
    if (game.homeScore! < game.awayScore!) return "LOSS";
    return "DRAW";
  }

  if (game.awayScore! > game.homeScore!) return "WIN";
  if (game.awayScore! < game.homeScore!) return "LOSS";

  return "DRAW";
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
            "bg-green": getTeamResult(team, result, leagueTeams) === "WIN",
            "bg-slate-300 dark:bg-slate-600":
              getTeamResult(team, result, leagueTeams) === "DRAW",
            "bg-red": getTeamResult(team, result, leagueTeams) === "LOSS",
          })}
        />
      ))}
      <Tooltip id={"team-form-" + team.id}>
        <h1>Results</h1>
        <ul>
          {results.map((result, idx) => (
            <li
              key={idx}
              className="grid grid-cols-3 items-center gap-x-2 text-center"
            >
              <span
                className={cls({
                  "font-bold": team.id === leagueTeams[result.homeTeam!].id,
                  "text-green":
                    team.id === leagueTeams[result.homeTeam!].id &&
                    getTeamResult(team, result, leagueTeams) === "WIN",
                  "text-red":
                    team.id === leagueTeams[result.homeTeam!].id &&
                    getTeamResult(team, result, leagueTeams) === "LOSS",
                })}
              >
                {leagueTeams[result.homeTeam!].name}
              </span>
              <span>
                {result.homeScore} x {result.awayScore}
              </span>
              <span
                className={cls({
                  "font-bold": team.id === leagueTeams[result.awayTeam!].id,
                  "text-green":
                    team.id === leagueTeams[result.awayTeam!].id &&
                    getTeamResult(team, result, leagueTeams) === "WIN",
                  "text-red":
                    team.id === leagueTeams[result.awayTeam!].id &&
                    getTeamResult(team, result, leagueTeams) === "LOSS",
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
