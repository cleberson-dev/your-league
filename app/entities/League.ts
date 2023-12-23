type Team = {
  name: string;
}

type Game = {
  teamA?: string;
  teamB?: string;
}

const GAMES_AGAINST_EACH_OTHER = 2; // Right now it's 2 games against each other;

export class League {
  fixtures: any[];

  constructor(public teams: Team[]) {
    this.fixtures = this._createFixtures();
    this._fillFixtures();
    this.print();
  }

  print() {
    this.fixtures.forEach((round: any, idx: any) => {
      console.log('Round ' + (idx + 1));
      round.forEach((game: any) => {
        console.log(`${game.teamA !== null ? (game.teamA + 1) : 'x'} - ${game.teamB !== null ? (game.teamB + 1) : 'x'}`);
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
        round.push({ teamA: null, teamB: null });
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
          game.teamA = 0;
        }

        if (roundIdx === 0) {
          game.teamA = gameIdx > 0 ? gameIdx : game.teamA;
          game.teamB = gameIdx === 0 ? this.numberOfTeams - 1 : this.numberOfTeams - gameIdx - 1;
        }

        if (roundIdx > 0) {
          if (gameIdx === 0) {
            const endIdx = this.numberOfTeams - 1;
            game.teamB = endIdx - (roundIdx % endIdx);
          }
          
          if (gameIdx > 0) {
            const gameOfPreviousRound = this.fixtures[roundIdx - 1][gameIdx];
            game.teamA = gameOfPreviousRound.teamA > 1 ? gameOfPreviousRound.teamA - 1 : this.numberOfTeams - 1;
            game.teamB = gameOfPreviousRound.teamB > 1 ? gameOfPreviousRound.teamB - 1 : this.numberOfTeams - 1;
          }
        }
      }
    }
  }
}

new League([
  { name: '1' },
  { name: '2' },
  { name: '3' },
  { name: '4' },
  { name: '5' },
  { name: '6' },
  { name: '7' },
  { name: '8' },
  { name: '9' },
  { name: '10' },
]);
