import { ArrowLongDownIcon, ArrowLongUpIcon } from "@heroicons/react/16/solid";
import cls from "classnames";

type TableHeadCellProps = {
  label: string;
  shortLabel?: string;
  hideHorizontalPadding?: boolean;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  onClick?: () => void;
  isTopLeftCell?: boolean;
  isTopRightCell?: boolean;
  isSorting?: boolean;
  sortColumnOrder?: "asc" | "desc" | null;
};

export default function TableHeadCell({
  align,
  hideHorizontalPadding,
  sortable,
  onClick,
  isTopLeftCell,
  isTopRightCell,
  label,
  shortLabel,
  isSorting,
  sortColumnOrder,
}: TableHeadCellProps) {
  const SortIcon =
    sortColumnOrder === "asc" ? ArrowLongUpIcon : ArrowLongDownIcon;

  return (
    <th
      className={cls({
        "py-1 first:pl-3 last:pr-6 hover:text-black lg:py-4 lg:first:pl-6 dark:hover:text-violet":
          true,
        "px-2 lg:px-4": !hideHorizontalPadding,
        "rounded-tl-md lg:rounded-tl-xl": isTopLeftCell,
        "rounded-tr-md lg:rounded-tr-xl": isTopRightCell,
        "text-left": align === "left",
        "text-center": align === "center",
        "text-right": align === "right",
        "cursor-pointer": sortable,
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
