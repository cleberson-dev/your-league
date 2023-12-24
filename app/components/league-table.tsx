import League from "~/entities/League";
import cls from "classnames";

const PROMOTION_SPOTS = 4;
const RELEGATION_SPOTS = 4;

type Props = {
  league: League;
};

export default function LeagueTable({ league }: Props) {
  return (
    <table className="w-full table-auto shadow">
      <thead className="bg-primary-dark text-sm text-black/50">
        <tr className="font-black lowercase">
          <th className="rounded-tl-2xl px-4 py-4 pl-6 font-black">Pos</th>
          <th className="px-4 py-4 text-left font-black">team</th>
          <th className="px-4 py-4 font-black">points</th>
          <th className="px-4 py-4 font-black">played</th>
          <th className="px-4 py-4 font-black">wins</th>
          <th className="px-4 py-4 font-black">draws</th>
          <th className="px-4 py-4 font-black">losses</th>
          <th className="py-4 font-black">gf</th>
          <th className="py-4 font-black">ga</th>
          <th className="py-4 font-black">+/-</th>
          <th className="rounded-tr-2xl px-4 py-4 pr-6 font-black">form</th>
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
