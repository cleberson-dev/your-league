export type Result = "WIN" | "DRAW" | "LOSS";

export type Team = {
  id: string;
  name: string;
  logoFiletype?: string | null;
}

export type Fixtures = Round[];

export type Round = Game[];

export type Game = {
  homeTeam: number | null;
  awayTeam: number | null;
  homeScore?: number;
  awayScore?: number;
  finished?: boolean;
}

export type Table = {
  position?: number;
  team: Team;
  games: (Game & { result: Result })[];
  points: number;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsConceived: number;
  goalsDifference: number;
}[];

export default class League {
  constructor(
    public name: string,
    public teams: Team[],
    public fixtures: Fixtures,
  ) {}

  static readonly GAMES_AGAINST_EACH_OTHER = 2; // Right now it's 2 games against each other;

  static readonly POINTS_PER_RESULT: Record<Result, number> = {
    WIN: 3,
    DRAW: 1,
    LOSS: 0,
  };

  static create(name: string, teams: Team[]): League {
    if (teams.length % 2 !== 0) throw new Error("The number of teams should be even!");

    const fixtures = League._createFixtures(teams);
    League._fillFixtures(fixtures, teams);

    return new League(name, teams, fixtures);
  }

  get numberOfTeams() {
    return this.teams.length;
  }

  get numberOfRounds() {
    return (this.numberOfTeams - 1) * League.GAMES_AGAINST_EACH_OTHER; 
  }

  get numberOfGamesPerRound() {
    return this.teams.length / 2;
  }

  private static _createFixtures(teams: Team[]): Fixtures {
    const numberOfTeams = teams.length;
    const numberOfRounds = (numberOfTeams - 1) * League.GAMES_AGAINST_EACH_OTHER;
    const numberOfGamesPerRound = numberOfTeams / League.GAMES_AGAINST_EACH_OTHER;

    const fixtures: Fixtures = [];
    for (let roundIdx = 0; roundIdx < numberOfRounds; roundIdx += 1) {
      const round: Round = [];
      for (let gameIdx = 0; gameIdx < numberOfGamesPerRound; gameIdx += 1) {
        round.push({ homeTeam: null, awayTeam: null });
      }
      fixtures.push(round);
    }
    return fixtures;
  }

  private static _fillFixtures(fixtures: Fixtures, teams: Team[]) {
    const numberOfTeams = teams.length;
    const numberOfRounds = (numberOfTeams - 1) * League.GAMES_AGAINST_EACH_OTHER;
    const numberOfGamesPerRound = numberOfTeams / League.GAMES_AGAINST_EACH_OTHER;
    
    for (let roundIdx = 0; roundIdx < numberOfRounds; roundIdx += 1) {
      const round = fixtures[roundIdx];
      for (let gameIdx = 0; gameIdx < numberOfGamesPerRound; gameIdx += 1) {
        const game = round[gameIdx];

        // The first team will start every first game in the round
        if (gameIdx === 0) {
          game.homeTeam = 0;
        }

        if (roundIdx === 0) {
          game.homeTeam = gameIdx > 0 ? gameIdx : game.homeTeam;
          game.awayTeam = gameIdx === 0 ? numberOfTeams - 1 : numberOfTeams - gameIdx - 1;
        }

        if (roundIdx > 0) {
          const endIdx = numberOfTeams - 1;

          if (gameIdx === 0) {
            game.awayTeam = endIdx - (roundIdx % endIdx);
          }
          
          if (gameIdx > 0) {
            const gameOfPreviousRound = fixtures[roundIdx - 1][gameIdx];
            game.homeTeam = gameOfPreviousRound.homeTeam! > 1 ? gameOfPreviousRound.homeTeam! - 1 : endIdx;
            game.awayTeam = gameOfPreviousRound.awayTeam! > 1 ? gameOfPreviousRound.awayTeam! - 1 : endIdx;
          }
        }

        // A team should play one round at home and the next one away, and so forth. 
        if (roundIdx % 2 !== 0) {
          [game.homeTeam, game.awayTeam] = [game.awayTeam, game.homeTeam];
        }
      }
    }
  }

  // Just for fun and testing :p
  simulate() {
    this.fixtures.forEach(round => {
      round.forEach(game => {
        game.finished = true;
        game.homeScore = Math.round(Math.random() * 3);
        game.awayScore = Math.round(Math.random() * 3);
      });
    });
  }

  static getTeamPercentage(points: number, gamesPlayed: number) {
    return points / (gamesPlayed * 3);
  }

  // Generated in real-time (but think about performance later)
  static getTable(fixtures: Fixtures, teams: Team[]) {
    const table: Table = teams.map((team) => ({
      team,
      games: [],
      points: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      goalsScored: 0,
      goalsConceived: 0,
      goalsDifference: 0,
      results: [],
    }));

    fixtures.forEach(round => {
      round.forEach(game => {
        if (!game.finished) return;

        const home = table[game.homeTeam!];
        const away = table[game.awayTeam!];

        [home, away].forEach(team => {
          const result = League.getTeamResult(team.team, game, teams);
          team.games.unshift({ ...game, result });
          team.points += League.POINTS_PER_RESULT[result];
          team.wins += +(result === "WIN");
          team.losses += +(result === "LOSS");
          team.draws += +(result === "DRAW");
        });

        home.goalsScored += game.homeScore!;
        home.goalsConceived += game.awayScore!;
        home.goalsDifference += game.homeScore! - game.awayScore!;

        away.goalsScored += game.awayScore!;
        away.goalsConceived += game.homeScore!;
        away.goalsDifference += game.awayScore! - game.homeScore!;
      });
    });
    return table
      .sort((b, a) => a.points - b.points || a.wins - b.wins || a.goalsDifference - b.goalsDifference)
      .map((team, idx) => ({...team, position: idx + 1 }));
  }

  static getTeamResult(team: Team, game: Game, leagueTeams: Team[]) {
    const isHome = team.id === leagueTeams[game.homeTeam!].id;
  
    if (isHome) {
      if (game.homeScore! > game.awayScore!) return "WIN";
      if (game.homeScore! < game.awayScore!) return "LOSS";
      return "DRAW";
    }
  
    if (game.awayScore! > game.homeScore!) return "WIN";
    if (game.awayScore! < game.homeScore!) return "LOSS";
  
    return "DRAW";
  }
}
