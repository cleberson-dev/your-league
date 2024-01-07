"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import cls from "classnames";
import { Fixtures, Team } from "~/entities/League.entity";
import { useFormContext } from "react-hook-form";

type Props = {
  fixtures: Fixtures;
  teams: Team[];
  onTeamClicked?: (
    roundIdx: number,
    gameIdx: number,
    homeOrAway: "home" | "away"
  ) => void;
  inSimulation: boolean;
};

export default function Fixtures({
  fixtures,
  teams,
  onTeamClicked,
  inSimulation,
}: Props) {
  const [currentRound, setCurrentRound] = useState(0);

  const goPrevRound = () => setCurrentRound(currentRound - 1);
  const goNextRound = () => setCurrentRound(currentRound + 1);

  const { register } = useFormContext();

  const scoreInputClassnames =
    "w-16 text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="self-start bg-primary text-center shadow dark:bg-dark/50">
      <div className="flex select-none items-center rounded-t bg-primary-dark p-2 text-black/50 dark:bg-dark dark:text-white/50">
        <button
          className="disabled:opacity-10"
          onClick={goPrevRound}
          disabled={currentRound === 0}
        >
          <ChevronLeftIcon width={16} height={16} />
        </button>
        <h1 className="flex-grow text-sm font-black lowercase">
          Round {currentRound + 1}
        </h1>
        <button
          className="disabled:opacity-10"
          onClick={goNextRound}
          disabled={currentRound === fixtures.length - 1}
        >
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>

      <ul className="text-sm">
        {fixtures[currentRound].map((game, gameIdx) => (
          <li
            key={gameIdx}
            className={cls({
              "grid grid-cols-[1fr_3rem_1fr] items-center transition-colors hover:bg-primary-dark/30 dark:hover:bg-dark":
                true,
              "bg-slate-100 dark:bg-dark/50": game.finished,
            })}
          >
            <span
              className={cls({
                "cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap p-2":
                  true,
                "bg-green/10 font-medium": game.homeScore! > game.awayScore!,
                "bg-red/10": game.awayScore! > game.homeScore!,
              })}
              onClick={() =>
                !inSimulation && onTeamClicked?.(currentRound, gameIdx, "home")
              }
            >
              {teams[game.homeTeam!].name}
            </span>
            <span>
              {inSimulation && (
                <div className="flex items-center">
                  <input type="number" className={scoreInputClassnames} {...register(`fixtures.${currentRound}.${gameIdx}.home`)} /> x{" "}
                  <input type="number" className={scoreInputClassnames} {...register(`fixtures.${currentRound}.${gameIdx}.away`)} />
                </div>
              )}
              {!inSimulation && game.finished
                ? `${game.homeScore} x ${game.awayScore}`
                : "x"}
            </span>
            <span
              className={cls({
                "cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap p-2":
                  true,
                "bg-green/10 font-medium": game.awayScore! > game.homeScore!,
                "bg-red/10": game.homeScore! > game.awayScore!,
              })}
              onClick={() =>
                !inSimulation && onTeamClicked?.(currentRound, gameIdx, "away")
              }
            >
              {teams[game.awayTeam!].name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
