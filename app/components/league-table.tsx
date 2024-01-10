"use client";

import { useState } from "react";
import cls from "classnames";
import { ArrowLongUpIcon, ArrowLongDownIcon } from "@heroicons/react/16/solid";
import TeamLogo from "~/components/team-logo";
import League, { Fixtures, Table, Team } from "~/entities/League.entity";
import TeamFormBullets from "./team-form-bullets";

const PROMOTION_SPOTS = 4;
const RELEGATION_SPOTS = 4;

type SpecialSpotColors = "green" | "blue" | "red" | "orange"; // Supported ones because of tailwind static nature

type SpecialSpot = {
  type: string;
  label: string;
  color: SpecialSpotColors;
  positions: number[]; // zero-based positions, it should be used .at method instead of bracket notation
};

const specialSpots: SpecialSpot[] = [
  {
    type: "promotion",
    label: "Promoted",
    color: "green",
    positions: [0, 1, 2, 3],
  },
  {
    type: "relegation",
    label: "Relegated",
    color: "red",
    positions: [16, 17, 18, 19],
  },
  {
    type: "special",
    label: "Special",
    color: "orange",
    positions: [10],
  },
];

const spotsArray: { label: string; color: SpecialSpotColors }[] = Array.from({
  length: 20,
  ...Object.fromEntries(
    specialSpots
      .map((spot) =>
        spot.positions.map((pos) => [
          pos,
          { color: spot.color, label: spot.label },
        ])
      )
      .flat()
  ),
});

type Props = {
  fixtures: Fixtures;
  teams: Team[];
};

const tableHeaders = [
  {
    key: "position",
    label: "Pos",
  },
  { key: "logo", label: "", sortable: false },
  { key: "team", label: "Team", align: "left", sortable: false },
  { key: "points", label: "Points", sortable: true },
  { key: "played", label: "Played", sortable: true },
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
  tableTeam: Table[number],
  leagueTeams: Team[]
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
  { key: "played", value: tableTeam.games.length },
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
      tableTeam.games.length > 0
        ? Math.round(
          100 * League.getTeamPercentage(tableTeam.points, tableTeam.games.length)
        )
        : 0,
    showHorizontalPadding: true,
  },
  {
    key: "form",
    showHorizontalPadding: true,
    element: (
      <div className="w-16">
        <TeamFormBullets
          team={tableTeam.team}
          results={tableTeam.games.slice(0, 5).reverse()}
          leagueTeams={leagueTeams}
        />
      </div>
    ),
  },
];

export default function LeagueTable({ fixtures, teams }: Props) {
  const [sortColumnIdx, setSortColumnIdx] = useState<number | null>(null);
  const [sortColumnOrder, setSortColumnOrder] = useState<"asc" | "desc" | null>(
    "asc"
  );

  let table = League.getTable(fixtures, teams);

  if (sortColumnIdx !== null) {
    table = table.sort((a, b) => {
      const rowDataA = mapTeamToRowData(a, teams)[sortColumnIdx]!;
      const rowDataB = mapTeamToRowData(b, teams)[sortColumnIdx]!;

      // TODO: Handle Strings as well because it'll mess up in the future
      let valueA = rowDataA.value as number | undefined;
      let valueB = rowDataB.value as number | undefined;

      const key = rowDataA.key;
      if (key === "form") {
        valueA = a.games
          .slice(0, 5)
          .reduce((acc, game) => acc + League.POINTS_PER_RESULT[game.result], 0);
        valueB = b.games
          .slice(0, 5)
          .reduce((acc, game) => acc + League.POINTS_PER_RESULT[game.result], 0);
      }

      if (valueA === undefined || valueB === undefined) return 0;

      return sortColumnOrder === "asc" ? valueA - valueB : valueB - valueA;
    });
  }

  const sortColumn = (colIdx: number) => {
    if (colIdx === sortColumnIdx) {
      const orders: ("asc" | "desc" | null)[] = ["desc", "asc", null];
      const nextOrderIdx =
        (orders.findIndex((order) => order === sortColumnOrder) + 1) %
        orders.length;
      const nextOrder = orders[nextOrderIdx];

      if (nextOrder === null) setSortColumnIdx(null);

      setSortColumnOrder(nextOrder);
      return;
    }

    setSortColumnIdx(colIdx);
    setSortColumnOrder("desc");
  };

  const SortIcon =
    sortColumnOrder === "asc" ? ArrowLongUpIcon : ArrowLongDownIcon;

  const isInPromotionSpot = (position: number) => position < PROMOTION_SPOTS;
  const isInRelegationSpot = (rowIdx: number) =>
    rowIdx >= teams.length - RELEGATION_SPOTS;
  const isHighlightedSortColumn = (colIdx: number) => colIdx === sortColumnIdx;

  return (
    <table className="w-full table-auto select-none shadow">
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
              onClick={header.sortable ? () => sortColumn(colIdx) : undefined}
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
      <tbody className="text-center text-sm text-black  dark:text-white">
        {table.map((team, rowIdx) => (
          <tr
            className="group border-b border-solid border-black/5 bg-primary transition-colors hover:bg-primary-dark dark:border-white/5 dark:bg-dark/50 dark:hover:bg-dark/60"
            key={team.team.name}
            title={spotsArray[rowIdx]?.label}
          >
            {mapTeamToRowData(team, teams).map((colData, colIdx) => (
              <td
                key={colData.key}
                className={cls({
                  "min-w-14 py-4 first:pl-6 last:pr-6 ": true,
                  "px-4": colData.showHorizontalPadding,
                  "font-bold": colData.bold,
                  "w-full": colData.fullWidth,
                  "text-left": colData.align === "left",
                  "bg-primary-dark dark:bg-darker/60":
                    isHighlightedSortColumn(colIdx),
                  "bg-green/10 group-hover:bg-green/20":
                    spotsArray[rowIdx]?.color === "green",
                  "bg-red/10 group-hover:bg-red/20":
                    spotsArray[rowIdx]?.color === "red",
                  "bg-orange-500/10 group-hover:bg-orange-500/20":
                    spotsArray[rowIdx]?.color === "orange",
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
