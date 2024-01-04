import { Team } from "~/entities/League.entity";

type Props = {
  team: Team;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const DEFAULT_LOGO = "/default-team-logo.png";

export default function TeamLogo({ team, ...props }: Props) {
	return (
		<img
			{...props}
			src={team.logoFiletype ? `/team-logos/${team.id}.${team.logoFiletype}` : DEFAULT_LOGO} 
		/>
	);
}