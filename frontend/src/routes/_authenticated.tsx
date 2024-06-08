// import { userQueryOptions } from "@/lib/api";
import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return (
      <div className="text-xl">
        You have to{" "}
        <a href="/api/login" className="font-semibold">
          Login!
        </a>
      </div>
    );
  }
  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (err) {
      return { user: null };
    }
  },
  component: Component,
});
