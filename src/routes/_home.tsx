import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_home")({
  component: Layout,
  beforeLoad: async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken && !window.location.href.includes("/pets/")) {
      throw redirect({
        to: "/",
      });
    }
  },
});

export default function Layout() {
  return <Outlet />;
}
