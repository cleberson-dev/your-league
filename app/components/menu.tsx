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
} from "@heroicons/react/16/solid";

import { useTheme } from "~/contexts/Theme.context";
import CrestIcon from "~/icons/crest.icon";
import MenuItem from "./menu-item";

const className = {
  menu: "text-gray-500 fixed left-0 top-0 z-40 h-[100svh] bg-slate-50 text-xs shadow dark:bg-dark",
  list: "flex h-full flex-col",
  mainSection: "flex-grow",
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
    <menu className={className.menu}>
      <ul className={className.list}>
        <div className={className.mainSection}>
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
