import { Link } from "@remix-run/react";
import LeagueCard from "./league-card";
import PaginationControls from "./pagination-controls";
import { TrashIcon } from "@heroicons/react/16/solid";

type Props = {
  leagues: {
    id: string;
    name: string;
    teamsCount: number;
  }[];
  removable?: boolean;
};

export default function LeaguesList({ leagues, removable }: Props) {
	if (leagues.length === 0)
		return (
			<p className="text-center text-2xl font-bold text-black/20 my-8">No Leagues</p>
		);

	return (
		<>
			<PaginationControls isNext />
			<ul className="mt-5 flex gap-x-7">
				{leagues.map((league) => (
					<li key={league.id} className="relative">
						{removable && (
							<div className="absolute top-2 right-2 z-20">
								<button className="rounded-full p-2 bg-white/20">
									<TrashIcon width={16} height={16} />
								</button>
							</div>
						)}
						<Link to={`/leagues/${league.id}`}>
							<LeagueCard name={league.name} teamsCount={league.teamsCount} />
						</Link>
					</li>
				))}
			</ul>
		</>
	);
}
