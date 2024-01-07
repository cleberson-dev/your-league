"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import cls from "classnames";
import { Fixtures, Team } from "~/entities/League.entity";
import { useFormContext } from "react-hook-form";
import TableFixtureScoreInput from "./table-fixture-score-input";

type Props = {
  fixtures: Fixtures;
  teams: Team[];
  inSimulation: boolean;
};

export default function Fixtures({ fixtures, teams, inSimulation }: Props) {
  const [currentRound, setCurrentRound] = useState<number | null>(0);

  const goPrevRound = () => {
    const currentRoundNumber = currentRound as number;
    setCurrentRound(null);

    // DON'T LOOK AT IT. IT WAS MY DOG
    setTimeout(() => {
      setCurrentRound(currentRoundNumber - 1);
    });
  };

  const goNextRound = () => {
    const currentRoundNumber = currentRound as number;
    setCurrentRound(null);

    // DON'T LOOK AT IT. IT WAS MY CAT
    setTimeout(() => {
      setCurrentRound(currentRoundNumber + 1);
    });
  };

  const { register } = useFormContext();

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
          Round {currentRound! + 1}
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
        {currentRound !== null && fixtures[currentRound].map((game, gameIdx) => (
          <li
            key={gameIdx}
            className={cls({
              "grid grid-cols-[1fr_4rem_1fr] items-center transition-colors hover:bg-primary-dark/30 dark:hover:bg-dark":
                true,
              "bg-slate-100 dark:bg-dark/50": game.finished,
            })}
          >
            <span
              className={cls({
                "overflow-hidden text-ellipsis whitespace-nowrap p-2": true,
                "bg-green/10 font-medium":
                  game.finished && game.homeScore! > game.awayScore!,
                "bg-red/10": game.finished && game.awayScore! > game.homeScore!,
              })}
            >
              {teams[game.homeTeam!].name}
            </span>
            <span className="flex items-center justify-center gap-x-2">
              <span className={cls({ hidden: inSimulation })}>
                {game.homeScore || ""}
              </span>
              <TableFixtureScoreInput
                className={cls({ hidden: !inSimulation })}
                {...register(`fixtures.${currentRound}.${gameIdx}.home`)}
              />
              <span>x</span>
              <span className={cls({ hidden: inSimulation })}>
                {game.awayScore || ""}
              </span>
              <TableFixtureScoreInput
                className={cls({ hidden: !inSimulation })}
                {...register(`fixtures.${currentRound}.${gameIdx}.away`)}
              />
            </span>
            <span
              className={cls({
                "overflow-hidden text-ellipsis whitespace-nowrap p-2": true,
                "bg-green/10 font-medium":
                  game.finished && game.awayScore! > game.homeScore!,
                "bg-red/10": game.finished && game.homeScore! > game.awayScore!,
              })}
            >
              {teams[game.awayTeam!].name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
