import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input className="rounded text-sm border-slate-200 bg-slate-100 dark:bg-darker/50 dark:border-darker/60" {...props} ref={ref} />
));

Input.displayName = "Input";

export default Input;