import { useForm, Form } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "./button";
import createTeamSchema from "~/schemas/create-team.schema";
import Input from "./input";
import ErrorMessage from "./error-message";

type Props = {
  onClose: () => void;
};

const className = {
  form: "flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow dark:bg-dark",
  title: "mb-8 text-2xl font-bold",
  formFields: "flex flex-grow flex-col gap-y-8",
  formGroup: "flex flex-col gap-y-1",
  label: "block",
  actionButtons: "flex justify-end gap-x-2",
};

export default function CreateTeamModal({ onClose }: Props) {
  const {
    control,
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(createTeamSchema),
  });

  return (
    <Form
      encType="multipart/form-data"
      className={className.form}
      control={control}
    >
      <input readOnly name="actionType" value="createTeam" className="hidden" />

      <h1 className={className.title}>Create your team</h1>
      <div className={className.formFields}>
        <div className={className.formGroup}>
          <label className={className.label}>Name</label>
          <Input autoComplete="off" {...register("name")} />
          <ErrorMessage message={errors.name?.message} />
        </div>
        <div className={className.formGroup}>
          <label className={className.label}>Logo</label>
          <input
            type="file"
            accept=".jpeg, .png, .svg, .jpg"
            {...register("logo")}
          />
          <ErrorMessage message={errors.logo?.message} />
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
    </Form>
  );
}
