// import { userQueryOptions } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return (
      <>
        <header className="h-12 border-b border-gray-100">
          <nav className="flex h-full w-full items-center justify-between gap-2 px-2">
            <h2 className="text-base font-semibold sm:text-xl">
              Expense Tracker
            </h2>
            <div className="flex items-center gap-2">
              <a
                href="/api/login"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Login
              </a>
              <a
                href="/api/register"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Sign Up
              </a>
            </div>
          </nav>
        </header>
        <hr />
        <div className="mx-auto max-w-4xl py-4 text-center md:py-10 xl:py-20">
          <div>
            <h2 className="text-xl md:text-3xl">
              <a href="/api/login" className="font-semibold">
                Login
              </a>{" "}
              to start tracking your expenses
            </h2>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <hr />
      <Outlet />
    </>
  );
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

function Navbar() {
  return (
    <header className="h-12">
      <nav className="flex h-full w-full items-center justify-between gap-2 px-2">
        <a href="/" className="text-base font-semibold sm:text-xl">
          Expense Tracker
        </a>
        <div className="flex items-center gap-4">
          <Link to="/add-expense">Add expense</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/logout"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Log out
          </a>
        </div>
      </nav>
    </header>
  );
}
