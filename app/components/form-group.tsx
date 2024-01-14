import ErrorMessage from "./error-message";

export type FormGroupProps = {
  label?: string;
  error?: string;
};

export default function FormGroup({ label, error, children }: React.PropsWithChildren<FormGroupProps>) {
  return (
    <div className="flex flex-col gap-y-1">
      {label && <label>{label}</label>}
      {children}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
