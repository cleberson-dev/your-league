"use client";

import { useState } from "react";
import League from "~/entities/League";
import LeagueTable from "./league-table";

const league = new League("", [], []);

export default function TableAndFixtures() {
	const [currentRound, setCurrentRound] = useState(0);

	return (
		<div className="flex flex-col w-full items-start p-8">
			<LeagueTable league={league} />
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
	);
}