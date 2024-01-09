import TeamLogo from "~/components/team-logo";
import { Team } from "~/entities/League.entity";

type Props = {
  team: Team;
  removable?: boolean;
};

export default function TeamCard({ team }: Props) {
  return (
    <div className="relative flex h-36 w-40 select-none flex-col justify-end rounded-3xl border border-solid border-black/5 bg-primary py-4 text-center font-medium text-black/50 dark:bg-dark dark:text-white">
      <div className="absolute top-0 flex h-full w-full items-center justify-center">
        <TeamLogo team={team} className="h-12" />
      </div>
      <span className="overflow-hidden text-ellipsis text-nowrap text-sm">
        {team.name}
      </span>
    </div>
  );
}
