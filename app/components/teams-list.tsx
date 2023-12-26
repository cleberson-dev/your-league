import TeamCard from "./team-card";

const mockTeams = [
  { id: 1, name: "Arsenal FC" },
  { id: 2, name: "Arsenal FC" },
  { id: 3, name: "Arsenal FC" },
  { id: 4, name: "Arsenal FC" },
  { id: 5, name: "Arsenal FC" },
];

type Props = {
  teams: {
    id: string;
    name: string;
  }[];
}

export default function TeamsList({ teams }: Props) {
  return (
    <ul className="mt-5 flex gap-x-4">
      {teams.map((team) => (
        <li key={team.id}>
          <TeamCard name={team.name} logo={`/team-logos/${team.id}.png`} />
        </li>
      ))}
    </ul>
  );
}
