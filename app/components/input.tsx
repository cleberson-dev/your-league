import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input
    className="rounded border-slate-200 bg-slate-100 text-sm dark:border-darker/60 dark:bg-darker/50"
    {...props}
    ref={ref}
  />
));

Input.displayName = "Input";

export default Input;
