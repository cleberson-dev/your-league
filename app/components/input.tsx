import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
	<input className="rounded border-gray-300" {...props} ref={ref} />
));

Input.displayName = "Input";
