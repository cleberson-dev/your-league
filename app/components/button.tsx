import cls from "classnames";
import { useModal } from "~/contexts/Modal.context";
import ConfirmationModal from "./confirmation.modal";
import { MouseEvent } from "react";

const buttonVariants = [
  "standard",
  "error",
  "info",
  "success",
  "neutral",
] as const;

type ButtonVariants = (typeof buttonVariants)[number];

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariants;
  confirmAction?: boolean;
};

const getClassNameByVariant = (variant: ButtonVariants) => {
  const className = {
    standard: "bg-violet text-white",
    error: "bg-red text-white",
    info: "bg-blue-500 text-white",
    success: "bg-green text-white",
    neutral: "bg-slate-100 text-black",
  };

  return className[variant];
};

export default function Button({
  className,
  variant = "standard",
  type = "button",
  confirmAction = false,
  onClick,
  ...props
}: Props) {
  const { showModal, hideModal } = useModal();

  const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    if (confirmAction) {
      showModal(
        <ConfirmationModal
          onConfirm={() => {
            onClick?.(e);
            hideModal();
          }}
          onClose={hideModal}
        />
      );
      return;
    }

    onClick?.(e);
  };

  return (
    <button
      {...props}
      className={cls(
        "rounded px-3 py-2 lg:px-4 lg:py-2 text-xs lg:text-sm transition-opacity hover:opacity-50 disabled:opacity-25",
        className,
        getClassNameByVariant(variant)
      )}
      type={type}
      onClick={clickHandler}
    >
      {props.children}
    </button>
  );
}
