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
    // Ensure the number of teams is even;

    this.fixtures = [];
    for (let roundIdx = 0; roundIdx < this.numberOfRounds; roundIdx += 1) {
      const round: any[] = [];
      for (let gameIdx = 0; gameIdx < this.numberOfGamesPerRound; gameIdx += 1) {
        round.push({ teamA: null, teamB: null });
      }
      this.fixtures.push(round);
    }

    for (let roundIdx = 0; roundIdx < this.numberOfRounds; roundIdx += 1) {
      const round = this.fixtures[roundIdx];
      for (let gameIdx = 0; gameIdx < this.numberOfGamesPerRound; gameIdx += 1) {
        const game = round[gameIdx];

        if (gameIdx === 0) {
          game.teamA = 0;

          if (roundIdx === 0) {
            game.teamB = this.numberOfTeams - 1;
          }
        }

        if (roundIdx === 0 && gameIdx > 0) {
          game.teamA = gameIdx;
          game.teamB = this.numberOfTeams - gameIdx - 1;
        }

        if (roundIdx > 0 && gameIdx === 0) {
          const endIdx = this.numberOfTeams - 1;
          game.teamB = this.numberOfTeams - 1 - (roundIdx % endIdx);
        }

        if (roundIdx > 0 && gameIdx > 0) {
          const gameOfPreviousRound = this.fixtures[roundIdx - 1][gameIdx];
          game.teamA = gameOfPreviousRound.teamA > 1 ? gameOfPreviousRound.teamA - 1 : this.numberOfTeams - 1;
          game.teamB = gameOfPreviousRound.teamB > 1 ? gameOfPreviousRound.teamB - 1 : this.numberOfTeams - 1;
        }
      }
    }

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
