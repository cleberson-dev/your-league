import cls from "classnames";

const buttonVariants = [
  "standard",
  "error",
  "info",
  "success",
  "neutral",
] as const;

type ButtonVariants = (typeof buttonVariants)[number];

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariants;
};

export default function Button({
  className,
  variant = "standard",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cls(
        "rounded px-4 py-2 text-sm transition-opacity hover:opacity-50 disabled:opacity-25",
        className,
        {
          standard: "bg-violet text-white",
          error: "bg-red text-white",
          info: "bg-blue-500 text-white",
          success: "bg-green text-white",
          neutral: "bg-slate-100 text-black",
        }[variant]
      )}
    >
      {props.children}
    </button>
  );
}
