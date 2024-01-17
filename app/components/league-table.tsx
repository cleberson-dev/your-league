"use client";

import TeamLogo from "~/components/team-logo";
import League, {
  Fixtures,
  Table as LeagueTable,
  Team,
} from "~/entities/League.entity";
import TeamFormBullets from "./team-form-bullets";
import Table, { DataDef, SpecialRow } from "./table";

const specialRows: SpecialRow[] = [
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

type Props = {
  fixtures: Fixtures;
  teams: Team[];
};


export default function LeagueTable({ fixtures, teams }: Props) {
  const table = League.getTable(fixtures, teams);

  return (
    <Table
      headers={[
        {
          key: "position",
          label: "Pos",
          shortLabel: "#",
        },
        { key: "logo", label: "", sortable: false },
        { key: "team", label: "Team", align: "left", sortable: false },
        { key: "points", label: "Points", shortLabel: "P" },
        { key: "played", label: "Played", shortLabel: "G" },
        { key: "wins", label: "Wins", shortLabel: "W", minWidth: "sm" },
        { key: "draws", label: "Draws", shortLabel: "D", minWidth: "sm" },
        { key: "losses", label: "Losses", shortLabel: "L", minWidth: "sm" },
        {
          key: "goalsFor",
          label: "GF",
          minWidth: "sm",
        },
        {
          key: "goalsAgainst",
          label: "GA",
          minWidth: "sm",
        },
        {
          key: "goalsDifference",
          label: "+/-",
        },
        {
          key: "percentage",
          label: "%",
        
          minWidth: "sm",
        },
        { key: "form", label: "Form", minWidth: "sm" },
      ]}
      specialRows={specialRows}
      data={table.map((tableTeam): DataDef[] => [
        {
          key: "position",
          value: tableTeam.position,
        },
        {
          key: "logo",
          element: (
            <div className="flex items-center justify-center">
              <TeamLogo team={tableTeam.team} className="h-4 lg:h-5" />
            </div>
          ),
        },
        {
          key: "team",
          value: tableTeam.team.name,
          align: "left",
          fullWidth: true,
        },
        { key: "points", value: tableTeam.points, bold: true },
        { key: "played", value: tableTeam.games.length },
        { key: "wins", value: tableTeam.wins },
        { key: "draws", value: tableTeam.draws },
        { key: "losses", value: tableTeam.losses },
        {
          key: "goalsFor",
          value: tableTeam.goalsScored,
        },
        {
          key: "goalsAgainst",
          value: tableTeam.goalsConceived,
        },
        {
          key: "goalsDifference",
          value: tableTeam.goalsDifference,
        },
        {
          key: "percentage",
          value:
            Math.round(100 * League.getTeamPercentage(tableTeam.points, tableTeam.games.length)),
        },
        {
          key: "form",
          value: tableTeam.games.slice(0, 5).reduce((acc, game) => acc + League.POINTS_PER_RESULT[game.result], 0),
          element: (
            <div className="w-16">
              <TeamFormBullets
                team={tableTeam.team}
                results={tableTeam.games.slice(0, 5).reverse()}
                leagueTeams={teams}
              />
            </div>
          ),
        },
      ])}
    />
  );
}
