import TeamLogo from "~/components/team-logo";
import { Team } from "~/entities/League.entity";

type Props = {
  team: Team;
  removable?: boolean;
};

const className = {
  card: "relative flex h-28 w-32 lg:h-36 lg:w-40 select-none flex-col justify-end rounded-3xl border border-solid border-black/5 bg-primary py-4 text-center font-medium text-black/50 dark:bg-dark dark:text-white",
  teamLogoContainer:
    "absolute top-0 flex h-full w-full items-center justify-center",
  teamLogo: "h-8 lg:h-12",
  teamName: "overflow-hidden text-ellipsis text-nowrap text-xs lg:text-sm",
};

export default function TeamCard({ team }: Props) {
  return (
    <div className={className.card}>
      <div className={className.teamLogoContainer}>
        <TeamLogo team={team} className={className.teamLogo} />
      </div>
      <span className={className.teamName}>{team.name}</span>
    </div>
  );
}
