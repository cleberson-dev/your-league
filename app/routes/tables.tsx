import Breadcrumb from "~/components/breadcrumb";

export default function TablesPage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tables" },
        ]}
      />
    </div>
  );
}
