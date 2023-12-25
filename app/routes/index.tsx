import { MetaFunction } from "@remix-run/react/dist/routeModules";
import TableAndFixtures from "~/components/table-fixtures";
import LeagueCard from "~/components/league-card";
import TeamCard from "~/components/team-card";
import cls from "classnames";

const leftArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </svg>
);

const rightArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </svg>
);

type PaginationControlsProps = {
  isPrevious?: boolean;
  isNext?: boolean;
  onPrevious?: () => void; 
  onNext?: () => void ;
}

const PaginationControls = ({ onPrevious, onNext, isPrevious, isNext }: PaginationControlsProps) => {
  const classes = {
    button: "h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center hover:",
    disabledButton: "opacity-30 cursor-default",
  }
  return (
    <div className="flex gap-x-1">
      <button 
        className={cls({
          [classes.button]: true,
          [classes.disabledButton]: !isPrevious
        })}
        onClick={onPrevious}
      >
        {leftArrow}
      </button>
      <button 
        className={cls({
          [classes.button]: true,
          [classes.disabledButton]: !isNext
        })} 
        onClick={onNext}
      >
        {rightArrow}
      </button>
    </div>
  );
}

export let meta: MetaFunction = () => {
  return {
    title: "Remix Template",
  };
};

const mockLeagues = [
  { id: 1, teams: 24, name: 'Premier League' },
  { id: 2, teams: 24, name: 'Premier League' },
  { id: 3, teams: 24, name: 'Premier League' },
  { id: 4, teams: 24, name: 'Premier League' },
  { id: 5, teams: 24, name: 'Premier League' },
];

const mockTeams = [
  { id: 1, name: 'Arsenal FC' },
  { id: 2, name: 'Arsenal FC' },
  { id: 3, name: 'Arsenal FC' },
  { id: 4, name: 'Arsenal FC' },
  { id: 5, name: 'Arsenal FC' },
]

export default function Index() {
  return (
    <div className="min-h-[100svh] py-12 px-16">
      {/* My Leagues */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-bold text-2xl">Your leagues</h1>
          <button className="bg-cyan-500 text-white py-2 px-4 rounded">+ Create a new League</button>
        </div>
        <PaginationControls isNext />
        <ul className="mt-5 flex gap-x-7">
          {mockLeagues.map(league => (
            <li key={league.id}>
              <LeagueCard name={league.name} teamsCount={league.teams} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-bold text-2xl">Your teams</h1>
          <button className="bg-cyan-500 text-white py-2 px-4 rounded">+ Create a new Team</button>
        </div>
        <PaginationControls isNext />
        <ul className="mt-5 flex gap-x-4">
          {mockTeams.map(team => (
            <li key={team.id}>
              <TeamCard name={team.name} logo="/team-logo.png" />
            </li>
          ))}
        </ul>
      </div>
      {/* <TableAndFixtures /> */}
    </div>
  );
}
