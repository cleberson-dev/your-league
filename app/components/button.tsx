import cls from "classnames";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "standard" | "error" | "info" | "success" | "neutral";
};

export default function Button({
  className,
  variant = "standard",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cls({
        ["rounded px-4 py-2 text-sm transition-opacity hover:opacity-50 disabled:opacity-25 " +
        className]: true,
        "bg-violet text-white": variant === "standard",
        "bg-red text-white": variant === "error",
        "bg-blue-500 text-white": variant === "info",
        "bg-green text-white": variant === "success",
        "bg-slate-100 text-black": variant === "neutral"
      })}
    >
      {props.children}
    </button>
  );
}
