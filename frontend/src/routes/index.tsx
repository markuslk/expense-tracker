import { createFileRoute } from "@tanstack/react-router";
import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
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
    <div className="mx-auto p-20 text-5xl">
      Total spent: {isPending ? 0 : data.total}€
    </div>
  );
}
