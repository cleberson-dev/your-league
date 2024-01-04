export type Team = {
  id: string;
  name: string;
  logoFiletype?: string | null;
}

export type Fixtures = Round[];
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
  position?: number;
  team: Team;
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
	constructor(
    public name: string,
    public teams: Team[],
    public fixtures: Fixtures,
	) {}

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
		return (this.numberOfTeams - 1) * GAMES_AGAINST_EACH_OTHER; 
	}

	get numberOfGamesPerRound() {
		return this.teams.length / 2;
	}

	private static _createFixtures(teams: Team[]): Fixtures {
		const numberOfTeams = teams.length;
		const numberOfRounds = (numberOfTeams - 1) * GAMES_AGAINST_EACH_OTHER;
		const numberOfGamesPerRound = numberOfTeams / GAMES_AGAINST_EACH_OTHER;

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
		const numberOfRounds = (numberOfTeams - 1) * GAMES_AGAINST_EACH_OTHER;
		const numberOfGamesPerRound = numberOfTeams / GAMES_AGAINST_EACH_OTHER;
    
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

	// Generated in real-time (but think about performance later)
	static getTable(fixtures: Fixtures, teams: Team[]) {
		const table: Table = teams.map((team) => ({
			team,
			games: 0,
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

				const draw = game.homeScore! === game.awayScore! ? 1 : 0;
				const homeWin = game.homeScore! > game.awayScore! ? 1 : 0;
				const awayWin = game.awayScore! > game.homeScore! ? 1 : 0;

				const home = table[game.homeTeam!];
				const away = table[game.awayTeam!];

				const [homeResult, awayResult] = League.getTeamResult(game);
        
				home.games += 1;
				home.points += homeWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW;
				home.wins += homeWin;
				home.losses += awayWin;
				home.draws += draw;
				home.goalsScored += game.homeScore!;
				home.goalsConceived += game.awayScore!;
				home.goalsDifference += game.homeScore! - game.awayScore!;
				home.results.unshift(homeResult);

				away.games += 1;
				away.points += awayWin * POINTS_PER_WIN + draw * POINTS_PER_DRAW;
				away.wins += awayWin;
				away.losses += homeWin;
				away.draws += draw;
				away.goalsScored += game.awayScore!;
				away.goalsConceived += game.homeScore!;
				away.goalsDifference += game.awayScore! - game.homeScore!;
				away.results.unshift(awayResult);
			});
		});
		return table
			.sort((b, a) => a.points - b.points || a.wins - b.wins || a.goalsDifference - b.goalsDifference)
			.map((team, idx) => ({...team, position: idx + 1 }));
	}

	static getTeamResult(game: Game): [TeamResult, TeamResult] {
		const homeWin = game.homeScore! > game.awayScore!;
		const awayWin = game.awayScore! > game.homeScore!;

		if (homeWin) return ["WIN", "LOSS"];
		if (awayWin) return ["LOSS", "WIN"];
    
		return ["DRAW", "DRAW"];
	}
}
