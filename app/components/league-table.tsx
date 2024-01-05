"use client";

import { useState } from "react";
import cls from "classnames";
import { ArrowLongUpIcon, ArrowLongDownIcon } from "@heroicons/react/16/solid";
import League, { Fixtures, Table, Team } from "~/entities/League.entity";
import TeamLogo from "./team-logo";

const PROMOTION_SPOTS = 4;
const RELEGATION_SPOTS = 4;

const pointsPerResult: Record<"WIN" | "DRAW" | "LOSS", number> = {
	WIN: 3,
	DRAW: 1,
	LOSS: 0,
};

type Props = {
  fixtures: Fixtures;
  teams: Team[];
};

const tableHeaders = [
	{ key: "position", label: "Pos", initialSortingOrder: "asc" as "asc" | "desc" },
	{ key: "logo", label: "", notSortable: true },
	{ key: "team", label: "Team", align: "left", notSortable: true },
	{ key: "points", label: "Points" },
	{ key: "played", label: "Played", notSortable: true },
	{ key: "wins", label: "Wins" },
	{ key: "draws", label: "Draws" },
	{ key: "losses", label: "Losses" },
	{ key: "goalsFor", label: "GF", hideHorizontalPadding: true },
	{ key: "goalsAgainst", label: "GA", hideHorizontalPadding: true },
	{ key: "goalsDifference", label: "+/-", hideHorizontalPadding: true },
	{ key: "percentage", label: "%", hideHorizontalPadding: true },
	{ key: "form", label: "Form" },
];

const mapTeamToRowData = (tableTeam: Table[number]): {
  key: string;
  element?: React.ReactNode;
  value?: string | number;
  showHorizontalPadding?: boolean;
  align?: "left" | "center" | "right";
  fullWidth?: boolean;
  bold?: boolean;
}[] => [
	{ key: "position", value: tableTeam.position, showHorizontalPadding: true },
	{ 
		key: "logo",
		element: (
			<div className="flex justify-center items-center">
				<TeamLogo
					team={tableTeam.team}
					className="h-5"
				/>
			</div>
		),
	},
	{ 
		key: "team",
		value: tableTeam.team.name,
		align: "left", 
		fullWidth: true, 
		showHorizontalPadding: true,
	},
	{ key: "points", value: tableTeam.points, bold: true },
	{ key: "played", value: tableTeam.games },
	{ key: "wins", value: tableTeam.wins },
	{ key: "draws", value: tableTeam.draws },
	{ key: "losses", value: tableTeam.losses },
	{ key: "goalsFor", value: tableTeam.goalsScored, showHorizontalPadding: true, },
	{ key: "goalsAgainst", value: tableTeam.goalsConceived, showHorizontalPadding: true, },
	{ key: "goalsDifference", value: tableTeam.goalsDifference, showHorizontalPadding: true, },
	{ key: "percentage", value: tableTeam.games > 0 ? Math.round(100 * (tableTeam.points / (tableTeam.games * 3))) : 0, showHorizontalPadding: true, },
	{ 
		key: "form", 
		showHorizontalPadding: true,
		element: (
			<div className="flex gap-x-1 w-16 justify-center items-center">
				{tableTeam.results.slice(0, 5).reverse().map((result, idx) => (
					<div 
						key={idx}
						className={
							cls({
								"h-2 w-2 rounded-full": true,
								"bg-slate-300": result === "DRAW",
								"bg-green": result === "WIN",
								"bg-red": result === "LOSS",
							})
						}/>
				))}
			</div>
		)
	},
]; 

export default function LeagueTable({ fixtures, teams }: Props) {
	const [sortColumnIdx, setSortColumnIdx] = useState<number | null>(null);
	const [sortColumnOrder, setSortColumnOrder] = useState<"asc" | "desc">("asc"); 

	let table = League.getTable(fixtures, teams);

	if (sortColumnIdx !== null) {
		table = table.sort((a, b) => {
      
			const rowDataA = mapTeamToRowData(a)[sortColumnIdx]!;
			const rowDataB = mapTeamToRowData(b)[sortColumnIdx]!;
      
			// TODO: Handle Strings as well because it'll mess up in the future
			let valueA = rowDataA.value as number | undefined;
			let valueB = rowDataB.value as number | undefined;
      
			const key = rowDataA.key;
			if (key === "form") {
				valueA = a.results.slice(0, 5).reduce((acc, result) => acc + pointsPerResult[result], 0);
				valueB = b.results.slice(0, 5).reduce((acc, result) => acc + pointsPerResult[result], 0);
			}

			if (valueA === undefined || valueB === undefined) return 0;
  
			return sortColumnOrder === "asc" ? valueA - valueB : valueB - valueA;
		});
	}

	const SortIcon = sortColumnOrder === "asc" ? ArrowLongUpIcon : ArrowLongDownIcon;

	return (
		<table className="w-full table-auto shadow">
			<thead className="bg-primary-dark dark:bg-dark text-sm text-black/50 dark:text-black/75 select-none">
				<tr className="font-black lowercase">
					{tableHeaders.map((header, idx) => (
						<th
							onClick={header.notSortable ? undefined : () => {
								if (idx === sortColumnIdx) {
									setSortColumnOrder(sortColumnOrder === "asc" ? "desc" : "asc");
									return;
								}

								setSortColumnIdx(idx);
								setSortColumnOrder(header.initialSortingOrder ?? "desc");
							}} 
							key={header.key}
							className={cls({
								"py-4 font-black first:pl-6 last:pr-6 hover:text-black dark:hover:text-violet": true,
								"px-4": !header.hideHorizontalPadding,
								"rounded-tl-2xl": idx === 0,
								"rounded-tr-2xl": idx === tableHeaders.length - 1,
								"text-left": header.align === "left",
								"cursor-pointer": !header.notSortable,
							})} 
						>
							<span className="relative">
								{header.label}
								{idx === sortColumnIdx && <SortIcon className="absolute top-[2px] -right-3" width={12} height={12} />}
							</span>
						</th>
					))}
				</tr>
			</thead>
			<tbody className="bg-primary dark:bg-dark/50 text-black dark:text-white text-center text-sm">
				{table.map((team, idx) => (
					<tr
						className={cls({
							"border-b border-solid border-black/5": true,
						})}
						key={team.team.name}
					>
						{mapTeamToRowData(team).map((colData, colIdx) => (
							<td
								key={colData.key}
								className={cls({
									"py-4 first:pl-6 last:pr-6 min-w-14": true,
									"px-4": colData.showHorizontalPadding,
									"font-bold": colData.bold,
									"w-full": colData.fullWidth,
									"text-left": colData.align === "left",
									"bg-primary-dark dark:bg-darker/60": colIdx === sortColumnIdx,
									"bg-green/10": idx < PROMOTION_SPOTS,
									"bg-red/10": idx > teams.length - 1 - RELEGATION_SPOTS,
									"bg-green/30 dark:bg-green/20": idx < PROMOTION_SPOTS && colIdx === sortColumnIdx,
									"bg-red/30 dark:bg-red/20": (idx > teams.length - 1 - RELEGATION_SPOTS) && colIdx === sortColumnIdx,
								})}
							>
								{colData.element ?? colData.value}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
