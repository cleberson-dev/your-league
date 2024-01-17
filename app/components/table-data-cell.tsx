import cls from "classnames";

export type Colors = "green" | "blue" | "red" | "orange"; // Supported ones because of tailwind static nature

type TableDataCellProps = {
  showHorizontalPadding?: boolean;
  bold?: boolean;
  fullWidth?: boolean;
  align?: "left" | "center" | "right";
  isHighlighted?: boolean;
  color?: Colors;
  element?: React.ReactNode;
  value?: string | number;
  tooltipText?: string;
  className?: string;
};

export default function TableDataCell({
  showHorizontalPadding,
  bold,
  fullWidth,
  align,
  isHighlighted,
  value,
  element,
  tooltipText,
  className,
  color,
}: TableDataCellProps) {
  return (
    <td
      title={tooltipText}
      className={cls(
        "min-w-7 overflow-hidden text-ellipsis whitespace-nowrap py-1 first:pl-3 last:pr-6 lg:min-w-14 lg:py-4 lg:first:pl-6",
        {
          "px-2 lg:px-4": showHorizontalPadding,
          "font-bold": bold,
          "w-full": fullWidth,
          "text-left": align === "left",
          "text-center": align === "center",
          "text-right": align === "right",
          "bg-primary-dark dark:bg-darker/60": isHighlighted,
        },
        color && {
          red: "bg-red/10 group-hover:bg-red/20",
          green: "bg-green/30 dark:bg-green/20",
          orange: "bg-orange-500/10 group-hover:bg-orange-500/20",
          blue: "bg-blue-500/10 group-hover:bg-blue/500/20", 
        }[color] || "",
        className
      )}
    >
      {element ?? value}
    </td>
  );
}
