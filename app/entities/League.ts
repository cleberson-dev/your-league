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
    this._randomizeTeams();
    this.fixtures = this._createFixtures();
    this._fillFixtures();
    this.print(true);
  }

  print(showNames: boolean = false) {
    this.fixtures.forEach((round: any, idx: any) => {
      console.log('Round ' + (idx + 1));
      round.forEach((game: any) => {
        let teamA, teamB;
        if (showNames) {
          teamA = showNames ? `${this.teams[game.teamA]!.name} [${game.teamA + 1}]` : game.teamA + 1;
          teamB = showNames ? `${this.teams[game.teamB]!.name} [${game.teamB + 1}]` : game.teamB + 1;
        }
        console.log(`${teamA} - ${teamB}`);
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

  private _randomizeTeams() {
    const randomTeams: any[] = [];
    while (this.teams.length) {
      const [randomTeam] = this.teams.splice(Math.floor(Math.random() * this.teams.length), 1);
      randomTeams.push(randomTeam);
    }
    this.teams = randomTeams;
  }
}

new League([
  { name: 'Flamengo' },
  { name: 'Fluminense' },
  { name: 'Vasco da Gama' },
  { name: 'São Paulo' },
  { name: 'Grêmio' },
  { name: 'Internacional' },
  { name: 'Portuguesa' },
  { name: 'Manchester City' },
  { name: 'Portsmouth' },
  { name: 'Real Sociedad' },
]);
