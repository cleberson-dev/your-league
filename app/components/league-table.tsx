"use client";

import { useState } from "react";
import cls from "classnames";
import { ArrowLongUpIcon, ArrowLongDownIcon } from "@heroicons/react/16/solid";
import League, { Fixtures, Table, Team } from "~/entities/League.entity";
import TeamLogo from "./team-logo";
import { getTeamPercentage } from "~/utils";

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
	{
		key: "position",
		label: "Pos",
		initialSortingOrder: "asc" as "asc" | "desc",
	},
	{ key: "logo", label: "", sortable: false },
	{ key: "team", label: "Team", align: "left", sortable: false },
	{ key: "points", label: "Points", sortable: true },
	{ key: "played", label: "Played", sortable: false },
	{ key: "wins", label: "Wins", sortable: true },
	{ key: "draws", label: "Draws", sortable: true },
	{ key: "losses", label: "Losses", sortable: true },
	{ key: "goalsFor", label: "GF", hideHorizontalPadding: true, sortable: true },
	{
		key: "goalsAgainst",
		label: "GA",
		hideHorizontalPadding: true,
		sortable: true,
	},
	{
		key: "goalsDifference",
		label: "+/-",
		hideHorizontalPadding: true,
		sortable: true,
	},
	{
		key: "percentage",
		label: "%",
		hideHorizontalPadding: true,
		sortable: true,
	},
	{ key: "form", label: "Form", sortable: true },
];

const mapTeamToRowData = (
	tableTeam: Table[number]
): {
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
			<div className="flex items-center justify-center">
				<TeamLogo team={tableTeam.team} className="h-5" />
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
	{
		key: "goalsFor",
		value: tableTeam.goalsScored,
		showHorizontalPadding: true,
	},
	{
		key: "goalsAgainst",
		value: tableTeam.goalsConceived,
		showHorizontalPadding: true,
	},
	{
		key: "goalsDifference",
		value: tableTeam.goalsDifference,
		showHorizontalPadding: true,
	},
	{
		key: "percentage",
		value:
			tableTeam.games > 0
				? Math.round(100 * getTeamPercentage(tableTeam.points, tableTeam.games))
				: 0,
		showHorizontalPadding: true,
	},
	{
		key: "form",
		showHorizontalPadding: true,
		element: (
			<div className="flex w-16 items-center justify-center gap-x-1">
				{tableTeam.results
					.slice(0, 5)
					.reverse()
					.map((result, idx) => (
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
		),
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
				valueA = a.results
					.slice(0, 5)
					.reduce((acc, result) => acc + pointsPerResult[result], 0);
				valueB = b.results
					.slice(0, 5)
					.reduce((acc, result) => acc + pointsPerResult[result], 0);
			}

			if (valueA === undefined || valueB === undefined) return 0;

			return sortColumnOrder === "asc" ? valueA - valueB : valueB - valueA;
		});
	}

	const sortColumn = (
		colIdx: number,
		initialSortingOrder?: "asc" | "desc"
	) => {
		if (colIdx === sortColumnIdx) {
			setSortColumnOrder(sortColumnOrder === "asc" ? "desc" : "asc");
			return;
		}

		setSortColumnIdx(colIdx);
		setSortColumnOrder(initialSortingOrder ?? "desc");
	};

	const SortIcon =
		sortColumnOrder === "asc" ? ArrowLongUpIcon : ArrowLongDownIcon;

	const isInPromotionSpot = (rowIdx: number) => rowIdx < PROMOTION_SPOTS;
	const isInRelegationSpot = (rowIdx: number) =>
		rowIdx >= teams.length - RELEGATION_SPOTS;
	const isHighlightedSortColumn = (colIdx: number) => colIdx === sortColumnIdx;

	const getTableRowTitle = (rowIdx: number) => {
		if (isInPromotionSpot(rowIdx)) return "Promoted";
		if (isInRelegationSpot(rowIdx)) return "Relegated";
		
		return undefined;
	}

	return (
		<table className="w-full table-auto shadow">
			<thead className="select-none bg-primary-dark text-sm text-black/50 dark:bg-dark dark:text-white/50">
				<tr className="font-black lowercase">
					{tableHeaders.map((header, colIdx) => (
						<th
							key={header.key}
							className={cls({
								"py-4 font-black first:pl-6 last:pr-6 hover:text-black dark:hover:text-violet":
									true,
								"px-4": !header.hideHorizontalPadding,
								"rounded-tl-xl": colIdx === 0,
								"rounded-tr-xl": colIdx === tableHeaders.length - 1,
								"text-left": header.align === "left",
								"cursor-pointer": header.sortable,
							})}
							onClick={
								header.sortable
									? () => sortColumn(colIdx, header.initialSortingOrder)
									: undefined
							}
						>
							<span className="relative">
								{header.label}
								{isHighlightedSortColumn(colIdx) && (
									<SortIcon className="absolute -right-3 top-[2px] h-3 w-3" />
								)}
							</span>
						</th>
					))}
				</tr>
			</thead>
			<tbody className="bg-primary text-center text-sm text-black dark:bg-dark/50 dark:text-white">
				{table.map((team, rowIdx) => (
					<tr
						className="border-b border-solid border-black/5 dark:border-white/5"
						key={team.team.name}
						title={getTableRowTitle(rowIdx)}
					>
						{mapTeamToRowData(team).map((colData, colIdx) => (
							<td
								key={colData.key}
								className={cls({
									"min-w-14 py-4 first:pl-6 last:pr-6": true,
									"px-4": colData.showHorizontalPadding,
									"font-bold": colData.bold,
									"w-full": colData.fullWidth,
									"text-left": colData.align === "left",
									"bg-primary-dark dark:bg-darker/60":
										isHighlightedSortColumn(colIdx),
									"bg-green/10": isInPromotionSpot(rowIdx),
									"bg-red/10": isInRelegationSpot(rowIdx),
									"bg-green/30 dark:bg-green/20":
										isInPromotionSpot(rowIdx) &&
										isHighlightedSortColumn(colIdx),
									"bg-red/30 dark:bg-red/20":
										isInRelegationSpot(rowIdx) &&
										isHighlightedSortColumn(colIdx),
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
