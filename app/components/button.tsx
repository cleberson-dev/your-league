type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: Props) {
  return (
    <button
      {...props}
      className={
        "rounded bg-violet px-4 py-2 text-sm text-white transition-opacity hover:opacity-50 disabled:bg-slate-300 disabled:text-black disabled:opacity-25 " +
        className
      }
    >
      {props.children}
    </button>
  );
}
