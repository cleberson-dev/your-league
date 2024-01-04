import { TrashIcon } from "@heroicons/react/16/solid";
import TeamLogo from "~/components/team-logo";
import { Team } from "~/entities/League";

type Props = {
  team: Team;
  removable?: boolean;
};

export default function TeamCard({ team, removable }: Props) {
	return (
		<div className="group relative flex h-36 w-40 select-none flex-col justify-end rounded-3xl border border-solid border-black/5 bg-primary py-4 text-center font-medium text-black/50">
			<div className="absolute top-2 right-2">
				{removable && <button><TrashIcon width={16} height={16} /></button>}
			</div>
			<div className="absolute top-0 flex h-full w-full items-center justify-center">
				<TeamLogo team={team} className="h-12" />
			</div>
			<span className="overflow-hidden text-ellipsis text-nowrap text-sm group-hover:text-black">
				{team.name}
			</span>
		</div>
	);
}
