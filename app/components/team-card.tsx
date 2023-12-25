type Props = {
  name: string;
  logo: string;
};

export default function TeamCard({ name, logo }: Props) {
  return (
    <div className="relative flex h-36 w-40 cursor-pointer select-none flex-col justify-end rounded-3xl border border-solid border-black/5 bg-primary py-4 text-center font-medium text-black/50">
      <div className="absolute top-0 flex h-full w-full items-center justify-center">
        <img src={logo} className="h-12" />
      </div>
      <span className="overflow-hidden text-ellipsis text-nowrap text-sm">
        {name}
      </span>
    </div>
  );
}
