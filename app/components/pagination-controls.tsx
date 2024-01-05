import cls from "classnames";
import LeftArrowIcon from "~/icons/left-arrow.icon";
import RightArrowIcon from "~/icons/right-arrow.icon";

type Props = {
  isPrevious?: boolean;
  isNext?: boolean;
  onPrevious?: () => void; 
  onNext?: () => void;
}

export default function PaginationControls({ onPrevious, onNext, isPrevious, isNext }: Props) {
	const classes = {
		button: "h-8 w-8 rounded-full bg-gray flex items-center justify-center transition-colors",
		disabledButton: "opacity-30 cursor-default hover:bg-gray",
		enabledButton: "hover:bg-gray-200",
	};

	return (
		<div className="flex gap-x-1">
			<button 
				className={cls({
					[classes.button]: true,
					[classes.disabledButton]: !isPrevious,
					[classes.enabledButton]: isPrevious,
				})}
				onClick={onPrevious}
			>
				<LeftArrowIcon />
			</button>
			<button 
				className={cls({
					[classes.button]: true,
					[classes.disabledButton]: !isNext,
					[classes.enabledButton]: isNext,
				})} 
				onClick={onNext}
			>
				<RightArrowIcon />
			</button>
		</div>
	);
}