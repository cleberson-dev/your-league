import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input className="rounded border-gray-300 dark:bg-darker/50 dark:border-white/5" {...props} ref={ref} />
));

Input.displayName = "Input";

export default Input;