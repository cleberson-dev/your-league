import { useState } from "react";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
  TableCellsIcon,
  CalendarDaysIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
} from "@heroicons/react/16/solid";

import { useTheme } from "~/contexts/Theme.context";
import CrestIcon from "~/icons/crest.icon";
import MenuItem from "./menu-item";
import cls from "classnames";

const className = {
  menu: "z-40 fixed left-0 top-0 text-xs",
  list: (isCollapsed?: boolean) =>
    cls({
      "flex-col h-[100svh] text-gray-500 shadow bg-slate-50 dark:bg-dark": true,
      flex: !isCollapsed,
      "hidden md:flex": isCollapsed,
    }),
  mainSection: "md:flex-grow",
  button: "p-4 md:hidden",
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
      className: "hidden md:block",
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
    <menu className={className.menu}>
      <button
        className={className.button}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Open menu" : "Close menu"}
      >
        {isCollapsed ? (
          <Bars3Icon className="h-4 w-4" />
        ) : (
          <ArrowLongLeftIcon className="h-4 w-4" />
        )}
      </button>
      <ul className={className.list(isCollapsed)}>
        <div className={className.mainSection}>
          {links.map((link) => (
            <li key={link.href} title={link.label} className={link.className}>
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
