import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/16/solid";
import { Link } from "@remix-run/react";
import cls from "classnames";
import { useState } from "react";

type MenuProps = {
  isLoggedIn: boolean;
}

export default function Menu({ isLoggedIn }: MenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const links = [
    {
      href: "#",
      onClick: () => setIsCollapsed(!isCollapsed),
      Icon: isCollapsed ? ArrowLongRightIcon : ArrowLongLeftIcon,
      label: isCollapsed ? "Expand" : "Collapse",
    },
    { href: "/", Icon: HomeIcon, label: "Home" },
  ];

  const bottomLinks = [
    {
      href: isLoggedIn ? "/logout" : "/login",
      Icon: isLoggedIn ? ArrowRightStartOnRectangleIcon: ArrowRightEndOnRectangleIcon,
      label: isLoggedIn ? "Logout" : "Login",
    },
  ];

  return (
    <menu className="fixed left-0 top-0 h-[100svh] bg-slate-50 text-gray-500 shadow text-xs z-40">
      <ul className="flex h-full flex-col">
        <div className="flex-grow">
          {links.map((link) => (
            <li
              className="group transition-colors hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-400"
              onClick={link.onClick}
            >
              <Link
                to={link.href}
                className="flex items-center gap-x-4 p-4 group-hover:text-white"
              >
                <link.Icon className="h-4 w-4 text-indigo-500 transition-colors group-hover:text-white" />
                <span className={cls({ hidden: isCollapsed })}>
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </div>
        <div>
          {bottomLinks.map((link) => (
            <li className="group transition-colors hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400">
              <Link to={link.href} className="flex items-center gap-x-4 p-4">
                <link.Icon
                  className="h-4 w-4 text-red-500 transition-colors group-hover:text-white"
                />
                <span className={cls({ hidden: isCollapsed })}>
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </div>
      </ul>
    </menu>
  );
}
