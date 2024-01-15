import ReactSelect from "react-select";
import cls from "classnames";

const className = {
  control:
    "p-2 rounded text-sm border border-solid border-slate-200 bg-slate-100 dark:bg-darker/50 dark:border-darker/60 dark:text-white",
  valueContainer: "gap-2",
  menuList: "bg-slate-100 dark:bg-darker/50",
  option: "p-2 text-sm hover:bg-slate-200 dark:hover:bg-violet",
  multiValue: "rounded gap-x-2 bg-violet text-white",
  multiValueLabel: "py-1 pl-2",
  multiValueRemove: "p-1 rounded-r hover:bg-red",
};
type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  defaultValue?: Option;
  options?: Option[];
  onChange?: (newOption: Option | null) => void;
};


export default function Select({ options, defaultValue, onChange }: SelectProps) {
  return (
    <>
      <div className={cls(["hidden", Object.values(className).join(" ")])} />
      <ReactSelect
        unstyled
        classNames={{
          control: () => className.control,
          valueContainer: () => className.valueContainer,
          multiValue: () => className.multiValue,
          menuList: () => className.menuList,
          option: () => className.option,
          multiValueRemove: () => className.multiValueRemove,
          multiValueLabel: () => className.multiValueLabel,
        }}
        options={options}
        defaultValue={defaultValue}
        onChange={(newOption) => onChange?.(newOption)}
      />
    </>
  );
}
