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

type Table = {
  team: number;
  points: number;
  wins: number;
  losses: number;
  draws: number;
}[];

const GAMES_AGAINST_EACH_OTHER = 2; // Right now it's 2 games against each other;

export default class League {
  fixtures: Fixtures;

  constructor(public teams: Team[]) {
    if (teams.length % 2 !== 0) throw new Error('The number of teams should be even!');

    this.teams = randomizeArray(this.teams);
    this.fixtures = this._createFixtures();
    this._fillFixtures();
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

  // Generated in real-time (but think about performance later)
  get table() {
    const table: Table = [];
    this.fixtures.forEach(round => {
      round.forEach(game => {
        if (!game.finished) return;

        const draw = game.homeScore! === game.awayScore! ? 1 : 0;
        const homeWin = game.homeScore! > game.awayScore! ? 1 : 0;
        const awayWin = game.awayScore! < game.homeScore! ? 1 : 0;

        const home = table[game.homeTeam!];
        const away = table[game.awayTeam!];

        if (!home) {
          table[game.homeTeam!] = {
            team: game.homeTeam!,
            points: homeWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW,
            wins: homeWin,
            losses: awayWin,
            draws: draw,
          };
        } else {
          home.points += homeWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW;
          home.wins += homeWin;
          home.losses += awayWin;
          home.draws += draw;
        };

        if (!away) {
          table[game.awayTeam!] = {
            team: game.awayTeam!,
            points: awayWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW,
            wins: awayWin,
            losses: homeWin,
            draws: draw,
          };
        } else {
          away.points += awayWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW;
          away.wins += awayWin;
          away.losses += homeWin;
          away.draws += draw;
        };
      })
    });
    return table.sort((a, b) => a.points - b.points || a.wins - b.wins);
  }
}
