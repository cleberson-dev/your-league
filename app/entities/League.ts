import { randomizeArray } from "~/utils";

type Team = {
  name: string;
}

type Fixtures = Round[];
type Round = Game[]; 
type Game = {
  homeTeam: number | null;
  awayTeam: number | null;
  homeScore?: number;
  awayScore?: number;
  finished?: boolean;
}

const POINTS_PER_WIN = 3;
const POINTS_PER_DRAW = 1;

type TeamResult = "WIN" | "DRAW" | "LOSS";

export type Table = {
  position: number;
  team: number;
  points: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsConceived: number;
  goalsDifference: number;
  results: TeamResult[];
}[];

const GAMES_AGAINST_EACH_OTHER = 2; // Right now it's 2 games against each other;

export default class League {
  fixtures: Fixtures;

  constructor(public teams: Team[]) {
    if (teams.length % 2 !== 0) throw new Error('The number of teams should be even!');

    this.teams = randomizeArray(this.teams);
    this.fixtures = this._createFixtures();
    this._fillFixtures();
    this.simulate();
  }

  print(showNames: boolean = false) {
    this.fixtures.forEach((round: any, idx: any) => {
      console.log('Round ' + (idx + 1));
      round.forEach((game: any) => {
        let homeTeam, awayTeam;
        if (showNames) {
          homeTeam = showNames ? `${this.teams[game.homeTeam]!.name} [${game.homeTeam + 1}]` : game.homeTeam + 1;
          awayTeam = showNames ? `${this.teams[game.awayTeam]!.name} [${game.awayTeam + 1}]` : game.awayTeam + 1;
        }
        console.log(`${homeTeam} - ${awayTeam}`);
      });
      console.log('------------');
    });
  }

  get numberOfTeams() {
    return this.teams.length;
  }

  get numberOfRounds() {
    return (this.numberOfTeams - 1) * GAMES_AGAINST_EACH_OTHER; 
  }

  get numberOfGamesPerRound() {
    return this.teams.length / 2;
  }

  private _createFixtures(): any[] {
    const fixtures: any[] = [];
    for (let roundIdx = 0; roundIdx < this.numberOfRounds; roundIdx += 1) {
      const round: any[] = [];
      for (let gameIdx = 0; gameIdx < this.numberOfGamesPerRound; gameIdx += 1) {
        round.push({ homeTeam: null, awayTeam: null });
      }
      fixtures.push(round);
    }
    return fixtures;
  }

  private _fillFixtures() {
    for (let roundIdx = 0; roundIdx < this.numberOfRounds; roundIdx += 1) {
      const round = this.fixtures[roundIdx];
      for (let gameIdx = 0; gameIdx < this.numberOfGamesPerRound; gameIdx += 1) {
        const game = round[gameIdx];

        // The first team will start every first game in the round
        if (gameIdx === 0) {
          game.homeTeam = 0;
        }

        if (roundIdx === 0) {
          game.homeTeam = gameIdx > 0 ? gameIdx : game.homeTeam;
          game.awayTeam = gameIdx === 0 ? this.numberOfTeams - 1 : this.numberOfTeams - gameIdx - 1;
        }

        if (roundIdx > 0) {
          const endIdx = this.numberOfTeams - 1;

          if (gameIdx === 0) {
            game.awayTeam = endIdx - (roundIdx % endIdx);
          }
          
          if (gameIdx > 0) {
            const gameOfPreviousRound = this.fixtures[roundIdx - 1][gameIdx];
            game.homeTeam = gameOfPreviousRound.homeTeam! > 1 ? gameOfPreviousRound.homeTeam! - 1 : endIdx;
            game.awayTeam = gameOfPreviousRound.awayTeam! > 1 ? gameOfPreviousRound.awayTeam! - 1 : endIdx;
          }
        }
      }
    }
  }

  setScore({ round, game, home, away }: { round: number; game: number; home: number; away: number }) {
    const roundGame = this.fixtures[round][game];
    roundGame.homeScore = home;
    roundGame.awayScore = away;
    roundGame.finished = true;
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

  // Generated in real-time (but think about performance later)
  get table() {
    const table: Table = [];
    this.fixtures.forEach(round => {
      round.forEach(game => {
        if (!game.finished) return;

        const draw = game.homeScore! === game.awayScore! ? 1 : 0;
        const homeWin = game.homeScore! > game.awayScore! ? 1 : 0;
        const awayWin = game.awayScore! > game.homeScore! ? 1 : 0;

        const home = table[game.homeTeam!];
        const away = table[game.awayTeam!];

        const [homeResult, awayResult] = this.getTeamResult(game);
        
        if (!home) {
          table[game.homeTeam!] = {
            team: game.homeTeam!,
            games: 1,
            points: homeWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW,
            wins: homeWin,
            losses: awayWin,
            draws: draw,
            goalsScored: game.homeScore!,
            goalsConceived: game.awayScore!,
            goalsDifference: game.homeScore! - game.awayScore!,
            results: [homeResult],
          };
        } else {
          home.games += 1;
          home.points += homeWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW;
          home.wins += homeWin;
          home.losses += awayWin;
          home.draws += draw;
          home.goalsScored += game.homeScore!;
          home.goalsConceived += game.awayScore!;
          home.goalsDifference += game.homeScore! - game.awayScore!;
          home.results.unshift(homeResult);
        };

        if (!away) {
          table[game.awayTeam!] = {
            team: game.awayTeam!,
            games: 1,
            points: awayWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW,
            wins: awayWin,
            losses: homeWin,
            draws: draw,
            goalsScored: game.awayScore!,
            goalsConceived: game.homeScore!,
            goalsDifference: game.awayScore! - game.homeScore!,
            results: [awayResult],
          };
        } else {
          away.games += 1;
          away.points += awayWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW;
          away.wins += awayWin;
          away.losses += homeWin;
          away.draws += draw;
          away.goalsScored += game.awayScore!;
          away.goalsConceived += game.homeScore!;
          away.goalsDifference += game.awayScore! - game.homeScore!;
          away.results.unshift(awayResult);
        };
      })
    });
    return table
      .sort((b, a) => a.points - b.points || a.wins - b.wins || a.goalsDifference - b.goalsDifference)
      .map((team, idx) => ({...team, position: idx + 1 }));
  }

  getTeamResult(game: Game): [TeamResult, TeamResult] {
    const homeWin = game.homeScore! > game.awayScore!;
    const awayWin = game.awayScore! > game.homeScore!;

    if (homeWin) return ["WIN", "LOSS"];
    if (awayWin) return ["LOSS", "WIN"];
    
    return ["DRAW", "DRAW"];
  }
}
