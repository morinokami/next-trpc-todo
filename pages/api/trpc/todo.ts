import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

import { v4 as uuidv4 } from "uuid";
import { TRPCError } from "@trpc/server";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const todos: Todo[] = [];

export const todoRouter = trpc
  .router()
  // create
  .mutation("add", {
    input: z.object({
      title: z.string(),
    }),
    resolve({ input }) {
      todos.push({
        id: uuidv4(),
        title: input.title,
        completed: false,
      });
      return todos[todos.length - 1];
    },
  })
  // read
  .query("all", {
    resolve() {
      return todos;
    },
  })
  // update
  .mutation("update", {
    input: z.object({
      id: z.string(),
      title: z.string().optional(),
      completed: z.boolean().optional(),
    }),
    resolve({ input }) {
      const todo = todos.find((t) => t.id === input.id);
      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Todo with id ${input.id} not found`,
        });
      }
      if (input.title !== undefined) {
        todo.title = input.title;
      }
      if (input.completed !== undefined) {
        todo.completed = input.completed;
      }
      return todo;
    },
  })
  // delete
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    resolve({ input }) {
      const { id } = input;
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      if (todoIndex === -1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Todo with id ${id} not found`,
        });
      } else {
        todos.splice(todoIndex, 1);
      }
      return { id };
    },
  });
