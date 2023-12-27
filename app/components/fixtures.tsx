"use client";

import { useState } from "react";

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
    <div className="text-center">
      <div className="flex items-center bg-slate-200 p-2">
        <button onClick={goPrevRound} disabled={currentRound === 0}>Prev.</button>
        <h1 className="font-bold flex-grow">Round {currentRound + 1}</h1>
        <button onClick={goNextRound} disabled={currentRound === fixtures.length - 1}>Next</button>
      </div>

      {fixtures[currentRound].map((game: any, gameIdx: any) => (
        <li key={gameIdx} className="grid grid-cols-3 p-2">
          <span className="items-end" onClick={() => onTeamClicked?.(currentRound, gameIdx, "home")}>{teams[game.homeTeam!].name}</span>
          {game.finished ? 
            <span>{game.homeScore} x {game.awayScore}</span> : <span>- x -</span>
          }
          <span onClick={() => onTeamClicked?.(currentRound, gameIdx, "away")}>{teams[game.awayTeam!].name}</span>
        </li>
      ))}
    </div>
  );
}
