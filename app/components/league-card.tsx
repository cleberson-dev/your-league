type Props = {
  name: string;
  teamsCount: number;
};

export default function LeagueCard({ name, teamsCount }: Props) {
	return (
		<div className="relative flex h-52 w-56 cursor-pointer select-none flex-col justify-end rounded-3xl border border-solid border-black/5 bg-primary dark:bg-dark dark:text-white py-5 text-center font-medium text-black/50 hover:text-black transition-colors">
			<div className="absolute top-0 flex h-full w-full flex-col items-center justify-center">
				<strong className="text-6xl font-black">{teamsCount}</strong>
				<small className="text-base">teams</small>
			</div>
			<span>{name}</span>
		</div>
	);
}
