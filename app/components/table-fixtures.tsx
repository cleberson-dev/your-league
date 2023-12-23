'use client';

import { useState } from "react";
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

export default function TableAndFixtures() {
  const [currentRound, setCurrentRound] = useState(0);

  return (
    <div className="flex w-full items-start">
      <table className="w-4/5 bg-slate-50 p-2 table-auto">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th>#</th>
            <th>Team</th>
            <th>M</th>
            <th>Pts.</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GS</th>
            <th>GC</th>
            <th>+/-</th>
          </tr>
        </thead>
        <tbody>
          {league.table.map((team, idx) => (
            <tr key={league.teams[team.team].name}>
              <td>{idx + 1}</td>
              <td>{league.teams[team.team].name}</td>
              <td>{team.games}</td>
              <td>{team.points}</td>
              <td>{team.wins}</td>
              <td>{team.draws}</td>
              <td>{team.losses}</td>
              <td>{team.goalsScored}</td>
              <td>{team.goalsConceived}</td>
              <td>{team.goalsDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-1/5 text-center">
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