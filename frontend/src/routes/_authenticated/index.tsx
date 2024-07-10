import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import ExpensesTable from "@/components/ExpensesTable";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (error) return "An error has occured:" + error.message;

  return (
    <div>
      <div className="flex items-center p-12 text-3xl">
        Total spent:{" "}
        {isPending ? <Skeleton className="h-8 w-20" /> : `${data.total}€`}
      </div>
      <ExpensesTable />
    </div>
  );
}
