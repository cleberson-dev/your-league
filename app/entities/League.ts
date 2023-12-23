type Team = {
  name: string;
}

type Fixtures = Round[];
type Round = Game[]; 
type Game = {
  homeTeam: number | null;
  awayTeam: number | null;
}

const GAMES_AGAINST_EACH_OTHER = 2; // Right now it's 2 games against each other;

export default class League {
  fixtures: Fixtures;

  constructor(public teams: Team[]) {
    if (teams.length % 2 !== 0) throw new Error('The number of teams should be even!');

    this._randomizeTeams();
    this.fixtures = this._createFixtures();
    this._fillFixtures();
    this.print(true);
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

  private _randomizeTeams() {
    const randomTeams: any[] = [];
    while (this.teams.length) {
      const [randomTeam] = this.teams.splice(Math.floor(Math.random() * this.teams.length), 1);
      randomTeams.push(randomTeam);
    }
    this.teams = randomTeams;
  }
}
