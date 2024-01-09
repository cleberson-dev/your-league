import cls from "classnames";

type TeamFormBulletsProps = {
  results: ("WIN" | "DRAW" | "LOSS")[];
};

export default function TeamFormBullets({ results }: TeamFormBulletsProps) {
  return (
    <div className="flex items-center justify-center gap-x-1">
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
    </div>
  );
}
