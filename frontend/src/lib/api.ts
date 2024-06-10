import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { type CreateExpense } from "@server/shared-types";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export async function getAllExpenses() {
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

export async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ["get-all-expenses"],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5,
});

export const getTotalSpentQueryOptions = queryOptions({
  queryKey: ["get-total-spent"],
  queryFn: getTotalSpent,
  staleTime: 1000 * 60 * 5,
});

export async function createExpense({ value }: { value: CreateExpense }) {
  const res = await api.expenses.$post({ json: value });
  if (!res.ok) {
    throw new Error("server error");
  }
  const newExpense = await res.json();
  return newExpense;
}
