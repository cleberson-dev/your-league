type ErrorMessageProps = {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return <p><small className="text-red">{message}</small></p>;
}