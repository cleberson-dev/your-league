import CreatableSelect from "react-select/creatable";
import { useFetcher } from "@remix-run/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Team } from "~/entities/League.entity";

import Button from "~/components/button";
import createLeagueSchema from "~/schemas/create-league.schema";
import Input from "./input";

type Props = {
  teams: Team[];
  onClose: () => void;
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

  const classes = "bg-darker";

  return (
    <form
      className="flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow dark:bg-dark"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="mb-10 text-2xl font-bold">Create your league</h1>
      <div className="flex flex-grow flex-col gap-y-8 overflow-auto">
        <div className="flex flex-col gap-y-1">
          <label className="block">Name</label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-red">
              <small>{errors.name.message}</small>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="block">Teams ({teamsCount} added)</label>
          <div className="mb-2 flex flex-col gap-y-2">
            <Controller
              name="teams"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  unstyled
                  classNames={{
                    valueContainer: () => "dark:bg-darker/50 dark:text-white px-2 py-2 rounded",
                    multiValue: () => "dark:bg-dark p-1",
                    menuList: () => "dark:bg-darker/50",
                    option: () => "p-4 hover:bg-red hover:dark:text-black"
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

            {errors.teams && (
              <p className="text-red">
                <small>{errors.teams.message}</small>
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-x-2">
        <Button type="submit" disabled={!isValid}>
          Create
        </Button>
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </div>
    </form>
  );
}
