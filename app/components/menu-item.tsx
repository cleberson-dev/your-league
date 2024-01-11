import { Link } from "@remix-run/react";
import cls from "classnames";

type MenuItemProps = {
  href: string;
  label: string;
  Icon: (props: React.SVGAttributes<SVGElement>) => React.ReactNode;
  onClick?: () => void;
  collapsed: boolean;
};

const className = {
  container:
    "group transition-colors hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-400",
  link: "flex items-center gap-x-4 p-4 group-hover:text-white",
  icon: "h-4 w-4 text-indigo-500 transition-colors group-hover:text-white",
  label: (hidden: boolean = false) => cls({ hidden }),
};

export default function MenuItem({
  href,
  label,
  Icon,
  onClick,
  collapsed,
}: MenuItemProps) {
  return (
    <div className={className.container} onClick={onClick} title={label}>
      <Link to={href} className={className.link}>
        <Icon className={className.icon} />
        <span className={className.label(collapsed)}>{label}</span>
      </Link>
    </div>
  );
}
