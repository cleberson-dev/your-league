import Breadcrumb from "~/components/breadcrumb";

export default function TeamsPage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Teams" },
        ]}
      />
    </div>
  );
}
