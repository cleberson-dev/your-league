import cls from "classnames";

export type Colors = "green" | "blue" | "red" | "orange"; // Supported ones because of tailwind static nature

type TableDataCellProps = {
  bold?: boolean;
  fullWidth?: boolean;
  align?: "left" | "center" | "right";
  isHighlighted?: boolean;
  color?: Colors;
  element?: React.ReactNode;
  value?: string | number;
  tooltipText?: string;
  className?: string;
  hidden?: boolean;
};

export default function TableDataCell({
  bold,
  fullWidth,
  align,
  isHighlighted,
  value,
  element,
  tooltipText,
  className,
  color,
  hidden,
}: TableDataCellProps) {
  if (hidden) return null;

  return (
    <td
      title={tooltipText}
      className={cls(
        "min-w-7 lg:min-w-14 overflow-hidden text-ellipsis whitespace-nowrap px-2 lg:px-4 py-1 lg:py-4",
        {
          "font-bold": bold,
          "w-full": fullWidth,
          "text-left": align === "left",
          "text-center": align === "center",
          "text-right": align === "right",
          "bg-primary-dark dark:bg-darker/60": isHighlighted,
        },
        color && {
          red: "bg-red/10 group-hover:bg-red/20",
          green: "bg-green/10 group-hover:bg-green/20",
          orange: "bg-orange-500/10 group-hover:bg-orange-500/20",
          blue: "bg-blue-500/10 group-hover:bg-blue-500/20", 
        }[color] || "",
        className
      )}
    >
      {element ?? value}
    </td>
  );
}
