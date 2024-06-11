import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteExpense,
  getAllExpensesQueryOptions,
  getTotalSpentQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { formatDateString } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  const { isPending, error, data } = useQuery(getAllExpensesQueryOptions);
  const {
    isPending: isPendingTotal,
    error: errorTotal,
    data: dataTotal,
  } = useQuery(getTotalSpentQueryOptions);
  const { data: loadingCreateExpense } = useQuery(
    loadingCreateExpenseQueryOptions,
  );

  if (error) return "An error has occured:" + error.message;

  if (errorTotal) return "An error has occured:" + errorTotal.message;
  return (
    <Table className="mx-auto max-w-screen-2xl">
      <TableCaption>A list of your recent expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loadingCreateExpense?.expense && (
          <TableRow>
            <TableCell>
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-4" />
            </TableCell>
          </TableRow>
        )}
        {isPending
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                </TableRow>
              ))
          : data.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{formatDateString(expense.date)}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell className="text-right">{expense.amount}</TableCell>
                <TableCell className="text-right">
                  <DeleteExpenseButton id={expense.id} />
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">
            {isPendingTotal ? "..." : `${dataTotal.total}€`}
          </TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function DeleteExpenseButton({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast("Error", {
        description: `Failed to delete expense: ${id}`,
      });
    },
    onSuccess: () => {
      toast("Expense deleted", {
        description: `Successfully deleted expense: ${id}`,
      });

      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter(
            (expense) => expense.id !== id,
          ),
        }),
      );
      queryClient.refetchQueries({
        queryKey: getTotalSpentQueryOptions.queryKey,
        exact: true,
      });
    },
  });
  return (
    <Button
      variant={"ghost"}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id })}
    >
      {mutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash className="h-4 w-4" />
      )}
    </Button>
  );
}
