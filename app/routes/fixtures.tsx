import Breadcrumb from "~/components/breadcrumb";

export default function FixturesPage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Fixtures" },
        ]}
      />
    </div>
  );
}
