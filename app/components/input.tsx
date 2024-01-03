import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>;

export default forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input className="rounded border-gray-300" {...props} ref={ref} />
));