import * as yup from "yup";

const createTeamSchema = yup.object({
	name: yup.string().min(3).max(32).required(),
	logo: yup
		.mixed<{ length: number; type: string }>()
		.test("fileType", "File type must be png, jpeg or svg", (value) => {
			if (!value || !value.length) return true; // logo should be optional
			return !!value.type.match(/jpg|jpeg|png|svg/);
		}),
});

export default createTeamSchema;
