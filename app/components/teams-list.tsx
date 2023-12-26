import PaginationControls from "./pagination-controls";
import TeamCard from "./team-card";

type Props = {
  teams: {
    id: string;
    name: string;
    logoFiletype?: string | null;
  }[];
};

export default function TeamsList({ teams }: Props) {
  if (teams.length === 0)
    return (
      <p className="my-8 text-center text-2xl font-bold text-black/20">
        No Teams
      </p>
    );

  return (
    <>
      <PaginationControls isNext />
      <ul className="mt-5 flex gap-x-4">
        {teams.map((team) => (
          <li key={team.id}>
            <TeamCard
              name={team.name}
              logo={
                team.logoFiletype
                  ? `/team-logos/${team.id}.${team.logoFiletype}`
                  : ""
              }
            />
          </li>
        ))}
      </ul>
    </>
  );
}
