"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import cls from "classnames";
import { Fixtures, Team } from "~/entities/League.entity";

type Props = {
  fixtures: Fixtures;
  teams: Team[];
  renderScore?: {
    home?: (
      roundIdx: number,
      gameIdx: number,
      score?: number
    ) => React.ReactNode;
    away?: (
      roundIdx: number,
      gameIdx: number,
      score?: number
    ) => React.ReactNode;
  };
};

const className = {
  container: "self-start bg-primary text-center shadow dark:bg-dark/50",
  header:
    "flex select-none items-center rounded-t bg-primary-dark p-2 text-black/50 dark:bg-dark dark:text-white/50",
  headerTitle: "flex-grow text-sm font-black lowercase",
  paginationButton: "disabled:opacity-10",
  list: "text-sm",
  listItem: (isGameFinished: boolean = false) =>
    cls({
      "grid grid-cols-[1fr_4rem_1fr] items-center transition-colors hover:bg-primary-dark/30 dark:hover:bg-dark":
        true,
      "bg-slate-100 dark:bg-dark/50": isGameFinished,
    }),
  teamName: (
    isGameFinished: boolean = false,
    teamScore: number,
    opponentScore: number
  ) =>
    cls({
      "overflow-hidden text-ellipsis whitespace-nowrap p-2": true,
      "bg-green/10 font-medium": isGameFinished && teamScore > opponentScore,
      "bg-red/10": isGameFinished && opponentScore > teamScore,
    }),
  gameScores: "flex items-center justify-center gap-x-2",
};

export default function Fixtures({ fixtures, teams, renderScore }: Props) {
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

  return (
    <div className={className.container}>
      <div className={className.header}>
        <button
          type="button"
          className={className.paginationButton}
          onClick={goPrevRound}
          disabled={currentRound === 0}
        >
          <ChevronLeftIcon width={16} height={16} />
        </button>
        <h1 className={className.headerTitle}>Round {currentRound! + 1}</h1>
        <button
          type="button"
          className={className.paginationButton}
          onClick={goNextRound}
          disabled={currentRound === fixtures.length - 1}
        >
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>

      <ul className={className.list}>
        {currentRound !== null &&
          fixtures[currentRound].map((game, gameIdx) => (
            <li key={gameIdx} className={className.listItem(game.finished)}>
              <span
                className={className.teamName(
                  game.finished,
                  game.homeScore!,
                  game.awayScore!
                )}
              >
                {teams[game.homeTeam!].name}
              </span>
              <span className={className.gameScores}>
                {renderScore?.home ? (
                  renderScore.home(currentRound, gameIdx, game.homeScore)
                ) : (
                  <span>{game.homeScore ?? ""}</span>
                )}
                <span>x</span>
                {renderScore?.away ? (
                  renderScore.away(currentRound, gameIdx, game.awayScore)
                ) : (
                  <span>{game.awayScore ?? ""}</span>
                )}
              </span>
              <span
                className={className.teamName(
                  game.finished,
                  game.awayScore!,
                  game.homeScore!
                )}
              >
                {teams[game.awayTeam!].name}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
