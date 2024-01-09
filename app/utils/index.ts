import { Game, Team } from "~/entities/League.entity";

export const randomizeArray = <T>(arr: T[]): T[] => {
  const randomArr = [];
  const copyArr = [...arr];

  while (copyArr.length) {
    const randomIdx = Math.floor(Math.random() * copyArr.length);
    const [randomItem] = copyArr.splice(randomIdx, 1);
    randomArr.push(randomItem);
  }

  return randomArr;
};

export const getTeamPercentage = (points: number, gamesPlayed: number) => {
  return points / (gamesPlayed * 3);
};

export const getTeamResult = (team: Team, game: Game, leagueTeams: Team[]) => {
  const isHome = team.id === leagueTeams[game.homeTeam!].id;

  if (isHome) {
    if (game.homeScore! > game.awayScore!) return "WIN";
    if (game.homeScore! < game.awayScore!) return "LOSS";
    return "DRAW";
  }

  if (game.awayScore! > game.homeScore!) return "WIN";
  if (game.awayScore! < game.homeScore!) return "LOSS";

  return "DRAW";
};
