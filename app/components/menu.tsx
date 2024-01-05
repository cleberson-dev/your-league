import { useState } from "react";
import { Link } from "@remix-run/react";
import cls from "classnames";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
  TableCellsIcon,
  CalendarDaysIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/16/solid";

import { useTheme } from "~/contexts/Theme.context";
import CrestIcon from "~/icons/crest.icon";

type MenuItemProps = {
	href: string;
	label: string;
	Icon: (props: React.SVGAttributes<SVGElement>) => React.ReactNode;
	onClick?: () => void;
	collapsed: boolean;
};

const MenuItem = ({ href, label, Icon, onClick, collapsed }: MenuItemProps) => {
  return (
    <div
      className="group transition-colors hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-400"
      onClick={onClick}
      title={label}
    >
      <Link
        to={href}
        className="flex items-center gap-x-4 p-4 group-hover:text-white"
      >
        <Icon className="h-4 w-4 text-indigo-500 transition-colors group-hover:text-white" />
        <span className={cls({ hidden: collapsed })}>{label}</span>
      </Link>
    </div>
  );
};

export default function Menu() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const links = [
    {
      href: "#",
      onClick: () => setIsCollapsed(!isCollapsed),
      icon: isCollapsed ? ArrowLongRightIcon : ArrowLongLeftIcon,
      label: isCollapsed ? "Expand" : "Collapse",
    },
    { href: "/dashboard", icon: HomeIcon, label: "Home" },
    { href: "/tables", icon: TableCellsIcon, label: "Tables" },
    { href: "/teams", icon: CrestIcon, label: "Teams" },
    { href: "/fixtures", icon: CalendarDaysIcon, label: "Fixtures" },
  ];

  const bottomLinks = [
    {
      href: "#",
      icon: theme === "light" ? SunIcon : MoonIcon,
      label: "Toggle theme",
      onClick: toggleTheme,
    },
    {
      href: "/logout",
      icon: ArrowRightStartOnRectangleIcon,
      label: "Logout",
    },
  ];

  return (
    <menu className="text-gray-500 fixed left-0 top-0 z-40 h-[100svh] bg-slate-50 text-xs shadow dark:bg-dark">
      <ul className="flex h-full flex-col">
        <div className="flex-grow">
          {links.map((link) => (
            <li key={link.href} title={link.label}>
              <MenuItem
                href={link.href}
                label={link.label}
                onClick={link.onClick}
                Icon={link.icon}
                collapsed={isCollapsed}
              />
            </li>
          ))}
        </div>
        <div>
          {bottomLinks.map((link) => (
            <li key={link.href} title={link.label}>
              <MenuItem
                href={link.href}
                label={link.label}
                onClick={link.onClick}
                Icon={link.icon}
                collapsed={isCollapsed}
              />
            </li>
          ))}
        </div>
      </ul>
    </menu>
  );
}
