import { Link } from "@remix-run/react";

type BreadcrumbProps = {
  items: { label: string; href?: string }[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <p className="text-sm mb-3 flex gap-x-2 select-none">
      {items.map((item) => (
        <span key={item.label} className="after:inline-block after:ml-2 after:content-['/'] last:after:content-none last:opacity-50">
          {item.href ? <Link to={item.href} className="hover:text-violet">{item.label}</Link> : item.label}
        </span>
      ))}
    </p>
  );
}
