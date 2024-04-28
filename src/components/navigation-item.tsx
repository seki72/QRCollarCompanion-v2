import { Link, LinkOptions } from "@tanstack/react-router";
import { ReactNode } from "react";

export default function NavigationItem({
  label,
  icon,
  linkOptions,
}: {
  label: string;
  icon: ReactNode;
  linkOptions: LinkOptions;
}) {
  return (
    <Link
      {...linkOptions}
      className="flex flex-col items-center gap-y-1 text-xs text-gray-50 hover:text-white"
    >
      <div className="rounded-full px-4 py-1 hover:bg-green-600">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}
