import { MetaFunction } from "@remix-run/react/dist/routeModules";
import League from "~/entities/League";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Template",
  };
};

const league = new League([
  { name: 'Flamengo' },
  { name: 'Fluminense' },
  { name: 'Vasco da Gama' },
  { name: 'São Paulo' },
  { name: 'Grêmio' },
  { name: 'Internacional' },
  { name: 'Portuguesa' },
  { name: 'Manchester City' },
  { name: 'Portsmouth' },
  { name: 'Real Sociedad' },
]);

export default function Index() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold my-8">It's YOUR LEAGUE!</h1>
      <ul className="w-4/5 text-center">
        {league.fixtures.map((round, roundIdx) => (
          <li className="mb-4">
            <h1 className="bg-slate-200 p-2 mb-2 font-bold">Round {roundIdx + 1}</h1>
            <ul>
              {round.map((game) => (
                <li className="grid grid-cols-3 p-2">
                  <span className="items-end">{league.teams[game.homeTeam!].name}</span>
                  <span className="">x</span>
                  <span>{league.teams[game.awayTeam!].name}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <h1 className="font-extrabold">Table</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Pts.</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
          </tr>
        </thead>
        <tbody>
          {league.table.map((team, idx) => (
            <tr>
              <td>{idx + 1}</td>
              <td>{league.teams[team.team].name}</td>
              <td>{team.points}</td>
              <td>{team.wins}</td>
              <td>{team.draws}</td>
              <td>{team.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
