import Button from "./button";

type ConfirmationModalProps = {
  onConfirm?: () => void;
  onClose?: () => void;
};

export default function ConfirmationModal({
  onConfirm,
  onClose,
}: ConfirmationModalProps) {
  return (
    <div className="flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow dark:bg-dark">
      <h1>Are you sure you want to do this?</h1>
      <div className="flex justify-end gap-x-2">
        <Button type={onConfirm ? "button" : "submit"} onClick={onConfirm}>
          Confirm
        </Button>
        <Button className="!bg-red" type="button" onClick={onClose}>
          Decline
        </Button>
      </div>
    </div>
  );
}
