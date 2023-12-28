import Button from "./button"

type Props = {
  onClose: () => void;
}

export default function CreateTeamModal({ onClose }: Props) {
  return (
    <div className="z-20 fixed left-0 top-0 flex h-[100svh] w-full items-center justify-center bg-black/10">
      <form
        encType="multipart/form-data"
        className="flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow"
        method="POST"
      >
        <input readOnly name="actionType" value="createTeam" className="hidden" />

        <h1 className="mb-8 text-2xl font-bold">Create your team</h1>
        <div className="flex flex-grow flex-col gap-y-8">
          <div>
            <label className="block">Name</label>
            <input
              required
              name="name"
              className="w-60 rounded border border-solid border-black/10"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block">Logo</label>
            <input
              type="file"
              name="logo"
              accept=".jpeg, .png, .svg, .jpg"
            />
          </div>
        </div>
        <div className="flex justify-end gap-x-2">
          <Button type="submit">Create</Button>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </form>
    </div>
  )
}
