import * as yup from "yup";

const createLeagueSchema = yup
	.object({
		name: yup.string().required(),
		teams: yup
			.array()
			.of(yup.string())
			.min(4)
			.required()
			.test(
				"evenTeamsCount",
				"The number of teams should be even",
				(teams) => teams.length % 2 === 0
			),
	})
	.required();

export default createLeagueSchema;