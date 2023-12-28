import { Team } from "~/entities/League";
import PaginationControls from "./pagination-controls";
import TeamCard from "./team-card";

type Props = {
  teams: Team[];
  removable?: boolean;
};

export default function TeamsList({ teams, removable }: Props) {
  if (teams.length === 0)
    return (
      <p className="my-8 text-center text-2xl font-bold text-black/20">
        No Teams
      </p>
    );

  return (
    <>
      <PaginationControls isNext />
      <ul className="mt-5 flex gap-x-4 overflow-auto">
        {teams.map((team) => (
          <li key={team.id}>
            <TeamCard
              team={team}
              removable={removable}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
