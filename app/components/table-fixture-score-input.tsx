import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const TableFixtureScoreInput = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input
    maxLength={2}
    className="bg-transparent w-6 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-t-0 border-x-0 text-center" 
    {...props} 
    ref={ref} 
  />
));

TableFixtureScoreInput.displayName = "TableFixtureScoreInput";

export default TableFixtureScoreInput;
