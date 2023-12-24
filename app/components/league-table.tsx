import League from "~/entities/League";
import cls from "classnames";

const PROMOTION_SPOTS = 4;
const RELEGATION_SPOTS = 4;

type Props = {
  league: League;
};

const tableHeaders = [
  { key: "position", label: "Pos" },
  { key: "team", label: "Team", align: 'left' },
  { key: "points", label: "Points" },
  { key: "played", label: "Played" },
  { key: "wins", label: "Wins" },
  { key: "draws", label: "Draws" },
  { key: "losses", label: "Losses" },
  { key: "goalsFor", label: "GF", hideHorizontalPadding: true, },
  { key: "goalsAgainst", label: "GA", hideHorizontalPadding: true, },
  { key: "goalsDifference", label: "+/-", hideHorizontalPadding: true, },
  { key: "form", label: "Form" },
];

export default function LeagueTable({ league }: Props) {
  return (
    <table className="w-full table-auto shadow">
      <thead className="bg-primary-dark text-sm text-black/50">
        <tr className="font-black lowercase">
          {tableHeaders.map((header, idx) => (
            <th 
              key={header.key}
              className={cls({
                "py-4 font-black": true,
                "px-4": !header.hideHorizontalPadding,
                "rounded-tl-2xl pl-6": idx === 0,
                "rounded-tr-2xl pr-6": idx === tableHeaders.length - 1,
                "text-left": header.align === 'left',
              })} 
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-primary text-center text-sm">
        {league.table.map((team, idx) => (
          <tr
            className={cls({
              "bg-green-100": idx < PROMOTION_SPOTS,
              "bg-red-100": idx > league.numberOfTeams - 1 - RELEGATION_SPOTS,
              "border-b border-solid border-black/5": true,
            })}
            key={league.teams[team.team].name}
          >
            <td className="px-4 py-4 pl-6">{idx + 1}</td>
            <td className="w-full px-4 py-4 text-left">
              {league.teams[team.team].name}
            </td>
            <td className="py-4 font-bold">{team.points}</td>
            <td className="py-4">{team.games}</td>
            <td className="py-4">{team.wins}</td>
            <td className="py-4">{team.draws}</td>
            <td className="py-4">{team.losses}</td>
            <td className="px-4 py-4">{team.goalsScored}</td>
            <td className="px-4 py-4">{team.goalsConceived}</td>
            <td className="px-4 py-4">{team.goalsDifference}</td>
            <td className="flex gap-x-1 px-4 py-6 pr-6">
              {team.results.slice(0, 5).reverse().map(result => (
                <div className={
                  cls({
                    "h-2 w-2 rounded-full": true,
                    "bg-slate-300": result === "DRAW",
                    "bg-green-400": result === "WIN",
                    "bg-red-400": result === "LOSS",
                  })
                }></div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
