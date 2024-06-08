import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde-auth";

const expenseSchema = z.object({
	id: z.number().int().positive().min(1),
	title: z.string().min(3).max(100),
	amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
	{ id: 1, title: "Some expense", amount: 5 },
	{ id: 2, title: "Some expense 2", amount: 50 },
	{ id: 3, title: "Some expense 3", amount: 500 },
];

export const expensesRoute = new Hono()
	.get("/", getUser, (c) => {
		return c.json({ expenses: fakeExpenses });
	})
	.post("/", getUser, zValidator("json", createPostSchema), async (c) => {
		const expense = await c.req.valid("json");
		fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
		c.status(201);
		return c.json({ expense });
	})

	.get("/total-spent", getUser, (c) => {
		const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
		return c.json({ total });
	})

	.get("/:id{[0-9]+}", getUser, (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const expense = fakeExpenses.find((expense) => expense.id === id);
		if (!expense) {
			return c.notFound();
		}
		return c.json({ expense });
	})
	.delete("/:id{[0-9]+}", getUser, (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const expense = fakeExpenses.find((expense) => expense.id === id);
		if (!expense) {
			return c.notFound();
		}
		fakeExpenses.splice(expense.id, 1);
		return c.json({ expense });
	});
