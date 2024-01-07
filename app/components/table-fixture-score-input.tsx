import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const TableFixtureScoreInput = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => (
    <input
      type="number"
      className={
        "w-6 border-x-0 border-t-0 bg-transparent p-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none " +
        className
      }
      {...props}
      ref={ref}
    />
  )
);

TableFixtureScoreInput.displayName = "TableFixtureScoreInput";

export default TableFixtureScoreInput;
