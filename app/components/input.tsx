import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return <input className="rounded border-gray-300" {...props} />
}
