import CreatableSelect from "react-select/creatable";
import { useFetcher } from "@remix-run/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import cls from "classnames";

import { Team } from "~/entities/League.entity";

import Button from "~/components/button";
import Input from "~/components/input";
import createLeagueSchema from "~/schemas/create-league.schema";
import ErrorMessage from "./error-message";

type Props = {
  teams: Team[];
  onClose: () => void;
};

const classes = {
  control:
    "p-2 rounded text-sm border border-solid border-slate-200 bg-slate-100 dark:bg-darker/50 dark:border-darker/60 dark:text-white",
  valueContainer: "gap-2",
  menuList: "bg-slate-100 dark:bg-darker/50",
  option: "p-2 text-sm hover:bg-slate-200 dark:hover:bg-violet",
  multiValue: "rounded gap-x-2 bg-violet text-white",
  multiValueLabel: "py-1 pl-2",
  multiValueRemove: "p-1 rounded-r hover:bg-red",
};

const className = {
  form: "flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow dark:bg-dark",
  title: "mb-10 text-2xl font-bold",
  formFields: "flex flex-grow flex-col gap-y-8 overflow-auto",
  formGroup: "flex flex-col gap-y-1",
  label: "block",
  actionButtons: "flex justify-end gap-x-2",
  teamsSelectContainer: "mb-2 flex flex-col gap-y-2",
};

export default function CreateLeagueModal({ teams, onClose }: Props) {
  const fetcher = useFetcher();

  const {
    control,
    register,
    formState: { errors, isValid },
    watch,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(createLeagueSchema),
    values: {
      name: "",
      teams: [],
    },
    mode: "onBlur",
  });
  const teamsCount = (watch("teams") || []).length;

  const onSubmit: Parameters<typeof handleSubmit>[0] = (values) => {
    const formData = new FormData();
    formData.append("actionType", "createLeague");
    Object.entries(values).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((team) => formData.append(key, team as string));
        return;
      }
      formData.append(key, val);
    });
    fetcher.submit(formData, { action: "/dashboard", method: "POST" });
    onClose();
  };

  return (
    <form className={className.form} onSubmit={handleSubmit(onSubmit)}>
      {/* React Select classes, so the compiler can bring desired classes */}
      <div className={cls(["hidden", Object.values(classes).join(" ")])} />

      <h1 className={className.title}>Create your league</h1>
      <div className={className.formFields}>
        <div className={className.formGroup}>
          <label className={className.label}>Name</label>
          <Input {...register("name")} />
          <ErrorMessage message={errors.name?.message} />
        </div>
        <div className={className.formGroup}>
          <label className={className.label}>Teams ({teamsCount} added)</label>
          <div className={className.teamsSelectContainer}>
            <Controller
              name="teams"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  unstyled
                  classNames={{
                    control: () => classes.control,
                    valueContainer: () => classes.valueContainer,
                    multiValue: () => classes.multiValue,
                    menuList: () => classes.menuList,
                    option: () => classes.option,
                    multiValueRemove: () => classes.multiValueRemove,
                    multiValueLabel: () => classes.multiValueLabel,
                  }}
                  isMulti
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={(newValues) =>
                    field.onChange(newValues.map(({ value }) => value))
                  }
                  options={teams.map((team) => ({
                    label: team.name,
                    value: JSON.stringify({ id: team.id }),
                  }))}
                  getNewOptionData={(newOption) => {
                    return {
                      label: newOption,
                      value: JSON.stringify({ name: newOption }),
                    };
                  }}
                />
              )}
            />
            <ErrorMessage message={errors.teams?.message} />
          </div>
        </div>
      </div>
      <div className={className.actionButtons}>
        <Button type="submit" disabled={!isValid}>
          Create
        </Button>
        <Button type="button" variant="neutral" onClick={onClose}>
          Close
        </Button>
      </div>
    </form>
  );
}
