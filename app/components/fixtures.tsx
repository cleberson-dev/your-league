"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import cls from "classnames";

type Props = {
  fixtures: any[];
  teams: any[];
  onTeamClicked?: (roundIdx: number, gameIdx: number, homeOrAway: "home" | "away") => void;
}

export default function Fixtures({ fixtures, teams, onTeamClicked }: Props) {
  const [currentRound, setCurrentRound] = useState(0);

  const goPrevRound = () => setCurrentRound(currentRound - 1);
  const goNextRound = () => setCurrentRound(currentRound + 1);

  return (
    <div className="text-center bg-primary shadow self-start">
      <div className="flex items-center bg-primary-dark text-black/50 p-2 rounded-t select-none">
        <button className="disabled:opacity-10" onClick={goPrevRound} disabled={currentRound === 0}>
          <ChevronLeftIcon width={16} height={16} />
        </button>
        <h1 className="font-black flex-grow text-sm lowercase">Round {currentRound + 1}</h1>
        <button className="disabled:opacity-10" onClick={goNextRound} disabled={currentRound === fixtures.length - 1}>
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>

      <ul className="text-sm">
        {fixtures[currentRound].map((game: any, gameIdx: any) => (
          <li key={gameIdx} className={cls({
            "grid grid-cols-[1fr_3rem_1fr] items-center hover:bg-primary-dark/30 transition-colors": true,
            "bg-slate-100": game.finished,
          })}>
            <span 
              className={cls({
                "p-2 items-end cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap": true,
                "bg-green-100 font-medium": game.homeScore > game.awayScore,
                "bg-red-100": game.awayScore > game.homeScore,
              })} 
              onClick={() => onTeamClicked?.(currentRound, gameIdx, "home")}
            >
              {teams[game.homeTeam!].name}
            </span>
            <span>
              {game.finished ? `${game.homeScore} x ${game.awayScore}` : "x"}
            </span> 
            <span 
              className={cls({
                "p-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap": true,
                "bg-green-100 font-medium": game.awayScore > game.homeScore,
                "bg-red-100": game.homeScore > game.awayScore,
              })} 
              onClick={() => onTeamClicked?.(currentRound, gameIdx, "away")}
            >
              {teams[game.awayTeam!].name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
