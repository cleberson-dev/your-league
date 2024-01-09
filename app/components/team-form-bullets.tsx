import cls from "classnames";
import { Tooltip } from "react-tooltip";
import { Team } from "~/entities/League.entity";

type TeamFormBulletsProps = {
  team: Team;
  results: ("WIN" | "DRAW" | "LOSS")[];
};

export default function TeamFormBullets({
  results,
  team,
}: TeamFormBulletsProps) {
  return (
    <div className="flex items-center justify-center gap-x-1" data-tooltip-id={"team-form-" + team.id}>
      {results.map((result, idx) => (
        <div
          key={idx}
          className={cls({
            "h-2 w-2 rounded-full": true,
            "bg-green": result === "WIN",
            "bg-slate-300 dark:bg-slate-600": result === "DRAW",
            "bg-red": result === "LOSS",
          })}
        />
      ))}
      <Tooltip id={"team-form-" + team.id}>
        <div>
          <h1>Hello</h1>
          <h1>Results here</h1>
        </div>
      </Tooltip>
    </div>
  );
}
