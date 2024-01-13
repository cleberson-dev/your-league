import { Link } from "@remix-run/react";
import { useTheme } from "~/contexts/Theme.context";

type Props = {
  className?: string;
};

export default function Logo({ className }: Props) {
  const { theme } = useTheme();

  const logoSrc = theme === "dark" ? "/logo-dark.svg" : "/logo.svg";

  return (
    <Link to="/">
      <img className={className} src={logoSrc} />
    </Link>
  );
}
