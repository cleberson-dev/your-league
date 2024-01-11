import Button from "./button";

type RemoveConfirmationModalProps = {
  onConfirm?: () => void;
  onClose?: () => void;
};

const className = {
  container: "flex flex-col rounded bg-white p-8 shadow dark:bg-dark",
  title: "whitespace-nowrap text-3xl font-bold mb-8",
  actionButtons: "flex justify-end gap-x-2",
};

export default function RemoveConfirmationModal({
  onConfirm,
  onClose,
}: RemoveConfirmationModalProps) {
  return (
    <div className={className.container}>
      <h1 className={className.title}>Are you sure you want to do this?</h1>
      <div className={className.actionButtons}>
        <Button
          type={onConfirm ? "button" : "submit"}
          variant="error"
          onClick={onConfirm}
        >
          Confirm
        </Button>
        <Button type="button" variant="neutral" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
