import { createRootRoute, Outlet, ScrollRestoration } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="antialiased">
      <ScrollRestoration />
      <Outlet />
    </div>
  ),
});
