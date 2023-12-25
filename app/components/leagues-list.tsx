import LeagueCard from "./league-card";

const mockLeagues = [
  { id: 1, teams: 24, name: "Premier League" },
  { id: 2, teams: 24, name: "Premier League" },
  { id: 3, teams: 24, name: "Premier League" },
  { id: 4, teams: 24, name: "Premier League" },
  { id: 5, teams: 24, name: "Premier League" },
];

export default function LeaguesList() {
  return (
    <ul className="mt-5 flex gap-x-7">
      {mockLeagues.map((league) => (
        <li key={league.id}>
          <LeagueCard name={league.name} teamsCount={league.teams} />
        </li>
      ))}
    </ul>
  );
}
