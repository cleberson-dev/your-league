type Props = {
  name: string;
  teamsCount: number;
};

const className = {
  card: "relative flex h-52 w-56 cursor-pointer select-none flex-col justify-end rounded-3xl border border-solid border-black/5 bg-primary py-5 text-center font-medium text-black/50 transition-colors hover:text-black dark:bg-dark dark:text-white dark:hover:text-violet",
  centeredContent:
    "absolute top-0 flex h-full w-full flex-col items-center justify-center text-base",
  teamsCount: "text-6xl font-black",
  teamsCountLabel: "text-base",
};

export default function LeagueCard({ name, teamsCount }: Props) {
  return (
    <div className={className.card}>
      <div className={className.centeredContent}>
        <strong className={className.teamsCount}>{teamsCount}</strong>
        <small className={className.teamsCountLabel}>teams</small>
      </div>
      <span>{name}</span>
    </div>
  );
}
