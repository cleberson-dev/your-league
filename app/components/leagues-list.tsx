import LeagueCard from "./league-card";
import PaginationControls from "./pagination-controls";

type Props = {
  leagues: {
    id: string;
    name: string;
    teamsCount: number;
  }[];
};

export default function LeaguesList({ leagues }: Props) {
  if (leagues.length === 0)
    return (
      <p className="text-center text-2xl font-bold text-black/20 my-8">No Leagues</p>
    );

  return (
    <>
      <PaginationControls isNext />
      <ul className="mt-5 flex gap-x-7">
        {leagues.map((league) => (
          <li key={league.id}>
            <LeagueCard name={league.name} teamsCount={league.teamsCount} />
          </li>
        ))}
      </ul>
    </>
  );
}
