'use client';

import { useState } from "react";
import cls from "classnames";
import League from "~/entities/League";

const league = new League([
  { name: 'Flamengo' },
  { name: 'Fluminense' },
  { name: 'Vasco da Gama' },
  { name: 'Botafogo' },
  { name: 'São Paulo' },
  { name: 'Corinthians' },
  { name: 'Palmeiras' },
  { name: 'RB Bragantino' },
  { name: 'Santos' },
  { name: 'Atlético-MG' },
  { name: 'Athletico-PR' },
  { name: 'Cruzeiro' },
  { name: 'Bahia' },
  { name: 'Cuiabá' },
  { name: 'Coritiba' },
  { name: 'América-MG' },
  { name: 'Sport Recife' },
  { name: 'Sampaio Corrêa' },
  { name: 'Remo' },
  { name: 'Paysandu' },
]);

const PROMOTION_SPOTS = 4;
const RELEGATION_SPOTS = 4;

export default function TableAndFixtures() {
  const [currentRound, setCurrentRound] = useState(0);

  return (
    <div className="flex flex-col w-full items-start p-8">
      <table className="w-full table-auto shadow">
        <thead className="bg-primary-dark text-black/50 text-sm">
          <tr className="font-black lowercase">
            <th className="font-black rounded-tl py-4 px-4 pl-6">Pos</th>
            <th className="text-left font-black py-4 px-4">team</th>
            <th className="font-black py-4 px-4">points</th>
            <th className="font-black py-4 px-4">played</th>
            <th className="font-black py-4 px-4">wins</th>
            <th className="font-black py-4 px-4">draws</th>
            <th className="font-black py-4 px-4">losses</th>
            <th className="font-black py-4">gf</th>
            <th className="font-black py-4">ga</th>
            <th className="font-black rounded-tr py-4 px-4 pr-6">+/-</th>
          </tr>
        </thead>
        <tbody className="bg-primary text-center text-sm">
          {league.table.map((team, idx) => (
            <tr className={cls({
              'bg-green-100': idx < PROMOTION_SPOTS,
              'bg-red-100': idx > (league.numberOfTeams - 1 - RELEGATION_SPOTS),
            })} key={league.teams[team.team].name}>
              <td className="py-4 px-4 pl-6 border-b border-solid border-black/5">{idx + 1}</td>
              <td className="w-full text-left py-4 px-4 border-b border-solid border-black/5">{league.teams[team.team].name}</td>
              <td className="py-4 font-bold border-b border-solid border-black/5">{team.points}</td>
              <td className="py-4 border-b border-solid border-black/5">{team.games}</td>
              <td className="py-4 border-b border-solid border-black/5">{team.wins}</td>
              <td className="py-4 border-b border-solid border-black/5">{team.draws}</td>
              <td className="py-4 border-b border-solid border-black/5">{team.losses}</td>
              <td className="py-4 px-4 border-b border-solid border-black/5">{team.goalsScored}</td>
              <td className="py-4 px-4 border-b border-solid border-black/5">{team.goalsConceived}</td>
              <td className="py-4 px-4 pr-6 border-b border-solid border-black/5">{team.goalsDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-1/5 text-center mt-10">
        <div className="flex items-center bg-slate-200 p-2">
          <button onClick={() => setCurrentRound(prev => prev - 1)} disabled={currentRound === 0}>Prev.</button>
          <h1 className="font-bold flex-grow">Round {currentRound + 1}</h1>
          <button onClick={() => setCurrentRound(prev => prev + 1)} disabled={currentRound === league.numberOfRounds - 1}>Next</button>
        </div>
        {league.fixtures[currentRound].map((game, gameIdx) => (
          <li key={gameIdx} className="grid grid-cols-3 p-2">
            <span className="items-end">{league.teams[game.homeTeam!].name}</span>
            {game.finished ? 
              <span>{game.homeScore} x {game.awayScore}</span> : <span>- x -</span>
            }
            <span>{league.teams[game.awayTeam!].name}</span>
          </li>
        ))}
      </div>
    </div>
  )
}