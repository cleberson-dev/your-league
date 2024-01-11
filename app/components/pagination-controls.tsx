import cls from "classnames";
import LeftArrowIcon from "~/icons/left-arrow.icon";
import RightArrowIcon from "~/icons/right-arrow.icon";

type Props = {
  isPrevious?: boolean;
  isNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
};

const className = {
  container: "flex gap-x-1",
  button:
    "h-8 w-8 rounded-full bg-gray dark:bg-dark flex items-center justify-center transition-colors",
  disabledButton: "opacity-30 cursor-default hover:bg-gray dark:hover:bg-dark",
  enabledButton: "hover:bg-gray-200 dark:hover:bg-white/20",
};

export default function PaginationControls({
  onPrevious,
  onNext,
  isPrevious,
  isNext,
}: Props) {
  return (
    <div className={className.container}>
      <button
        className={cls({
          [className.button]: true,
          [className.disabledButton]: !isPrevious,
          [className.enabledButton]: isPrevious,
        })}
        onClick={onPrevious}
      >
        <LeftArrowIcon />
      </button>
      <button
        className={cls({
          [className.button]: true,
          [className.disabledButton]: !isNext,
          [className.enabledButton]: isNext,
        })}
        onClick={onNext}
      >
        <RightArrowIcon />
      </button>
    </div>
  );
}
