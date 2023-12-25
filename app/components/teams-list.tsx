import TeamCard from "./team-card";

const mockTeams = [
  { id: 1, name: "Arsenal FC" },
  { id: 2, name: "Arsenal FC" },
  { id: 3, name: "Arsenal FC" },
  { id: 4, name: "Arsenal FC" },
  { id: 5, name: "Arsenal FC" },
];

export default function TeamsList() {
  return (
    <ul className="mt-5 flex gap-x-4">
      {mockTeams.map((team) => (
        <li key={team.id}>
          <TeamCard name={team.name} logo="/team-logo.png" />
        </li>
      ))}
    </ul>
  );
}
