import Logo from "./logo";

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-40 flex w-full items-center justify-center bg-white p-3 dark:bg-dark">
      <Logo className="h-6" />
    </header>
  );
}
