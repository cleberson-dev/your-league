"use client";

import League, { Fixtures, Table, Team } from "~/entities/League";
import cls from "classnames";
import { useState } from "react";

const PROMOTION_SPOTS = 4;
const RELEGATION_SPOTS = 4;

type Props = {
  fixtures: Fixtures;
  teams: Team[];
};

const tableHeaders = [
  { key: "position", label: "Pos", initialSortingOrder: 'asc' as 'asc' | 'desc' },
  { key: "team", label: "Team", align: 'left', notSortable: true },
  { key: "points", label: "Points" },
  { key: "played", label: "Played" },
  { key: "wins", label: "Wins" },
  { key: "draws", label: "Draws" },
  { key: "losses", label: "Losses" },
  { key: "goalsFor", label: "GF", hideHorizontalPadding: true },
  { key: "goalsAgainst", label: "GA", hideHorizontalPadding: true },
  { key: "goalsDifference", label: "+/-", hideHorizontalPadding: true },
  { key: "form", label: "Form", notSortable: true },
];

const mapTeamToRowData = (tableTeam: Table[number], teams: Team[]): {
  key: string;
  element?: any;
  value?: any;
  showHorizontalPadding?: boolean;
  align?: 'left' | 'center' | 'right';
  fullWidth?: boolean;
  bold?: boolean;
}[] => [
  { key: "position", value: tableTeam.position, showHorizontalPadding: true },
  { key: "team", value: teams[tableTeam.team].name, align: 'left', fullWidth: true, showHorizontalPadding: true, },
  { key: "points", value: tableTeam.points, bold: true },
  { key: "played", value: tableTeam.games },
  { key: "wins", value: tableTeam.wins },
  { key: "draws", value: tableTeam.draws },
  { key: "losses", value: tableTeam.losses },
  { key: "goalsFor", value: tableTeam.goalsScored, showHorizontalPadding: true, },
  { key: "goalsAgainst", value: tableTeam.goalsConceived, showHorizontalPadding: true, },
  { key: "goalsDifference", value: tableTeam.goalsDifference, showHorizontalPadding: true, },
  { 
    key: "form", 
    showHorizontalPadding: true,
    element: (
      <div className="flex gap-x-1">
        {tableTeam.results.slice(0, 5).reverse().map((result: any) => (
          <div className={
            cls({
              "h-2 w-2 rounded-full": true,
              "bg-slate-300": result === "DRAW",
              "bg-green-400": result === "WIN",
              "bg-red-400": result === "LOSS",
            })
          }></div>
        ))}
      </div>
    )
  },
] 

export default function LeagueTable({ fixtures, teams }: Props) {
  const [sortColumnIdx, setSortColumnIdx] = useState<number | null>(null);
  const [sortColumnOrder, setSortColumnOrder] = useState<'asc' | 'desc'>('asc'); 

  let table = League.getTable(fixtures, teams);

  if (sortColumnIdx !== null) {
    table = table.sort((a, b) => {
      const valueA = mapTeamToRowData(a, teams)[sortColumnIdx]!.value;
      const valueB = mapTeamToRowData(b, teams)[sortColumnIdx]!.value;
  
      return sortColumnOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }

  return (
    <table className="w-full table-auto shadow">
      <thead className="bg-primary-dark text-sm text-black/50">
        <tr className="font-black lowercase">
          {tableHeaders.map((header, idx) => (
            <th
              onClick={header.notSortable ? undefined : () => {
                if (idx === sortColumnIdx) {
                  setSortColumnOrder(sortColumnOrder === 'asc' ? 'desc' : 'asc');
                  return;
                }

                setSortColumnIdx(idx);
                setSortColumnOrder(header.initialSortingOrder ?? 'desc');
              }} 
              key={header.key}
              className={cls({
                "py-4 font-black first:pl-6 last:pr-6 cursor-pointer": true,
                "px-4": !header.hideHorizontalPadding,
                "rounded-tl-2xl": idx === 0,
                "rounded-tr-2xl": idx === tableHeaders.length - 1,
                "text-left": header.align === 'left',
                "cursor-default": header.notSortable,
                "text-red-600": sortColumnIdx === idx,
              })} 
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-primary text-center text-sm">
        {table.map((team, idx) => (
          <tr
            className={cls({
              "bg-green-100": idx < PROMOTION_SPOTS,
              "bg-red-100": idx > teams.length - 1 - RELEGATION_SPOTS,
              "border-b border-solid border-black/5": true,
            })}
            key={teams[team.team].name}
          >
            {mapTeamToRowData(team, teams).map(colData => (
              <td
                key={colData.key}
                className={cls({
                  "py-4 first:pl-6 last:pr-6": true,
                  "px-4": colData.showHorizontalPadding,
                  "font-bold": colData.bold,
                  "w-full": colData.fullWidth,
                  "text-left": colData.align === 'left',
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
