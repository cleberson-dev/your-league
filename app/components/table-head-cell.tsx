import { ArrowLongDownIcon, ArrowLongUpIcon } from "@heroicons/react/16/solid";
import cls from "classnames";

type TableHeadCellProps = {
  label: string;
  shortLabel?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  onClick?: () => void;
  isTopLeftCell?: boolean;
  isTopRightCell?: boolean;
  isSorting?: boolean;
  sortColumnOrder?: "asc" | "desc" | null;
  hidden?: boolean;
};

export default function TableHeadCell({
  align,
  sortable,
  onClick,
  isTopLeftCell,
  isTopRightCell,
  label,
  shortLabel,
  isSorting,
  sortColumnOrder,
  hidden,
}: TableHeadCellProps) {
  if (hidden) return null;

  const SortIcon =
    sortColumnOrder === "asc" ? ArrowLongUpIcon : ArrowLongDownIcon;

  return (
    <th
      className={cls({
        "py-1 lg:py-4 px-2 lg:px-4 dark:hover:text-violet hover:text-black" :
          true,
        "rounded-tl-md lg:rounded-tl-xl": isTopLeftCell,
        "rounded-tr-md lg:rounded-tr-xl": isTopRightCell,
        "text-left": align === "left",
        "text-center": align === "center",
        "text-right": align === "right",
        "cursor-pointer": sortable,
        "hidden": hidden,
      })}
      onClick={onClick}
    >
      <span className="relative">
        <span className={cls({ "hidden lg:inline": shortLabel })}>{label}</span>
        {shortLabel && <span className="lg:hidden">{shortLabel}</span>}
        {isSorting && (
          <SortIcon className="absolute -right-3 top-[2px] h-3 w-3" />
        )}
      </span>
    </th>
  );
}
