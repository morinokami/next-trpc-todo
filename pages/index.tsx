import { trpc } from "../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  title: string;
};

export default function IndexPage() {
  const { register, handleSubmit } = useForm<Inputs>();
  const utils = trpc.useContext();
  const todos = trpc.useQuery(["todo.all"]);
  const addTodo = trpc.useMutation("todo.add", {
    onSuccess: () => {
      utils.invalidateQueries(["todo.all"]);
    },
  });
  const updateTodo = trpc.useMutation("todo.update", {
    onSuccess: () => {
      utils.invalidateQueries(["todo.all"]);
    },
  });
  const deleteTodo = trpc.useMutation("todo.delete", {
    onSuccess: () => {
      utils.invalidateQueries(["todo.all"]);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addTodo.mutate({
      title: data.title,
    });
  };
  const onUpdate = (id: string, completed: boolean) => {
    updateTodo.mutate({
      id,
      completed,
    });
  };
  const onDelete = (id: string) => {
    deleteTodo.mutate({
      id,
    });
  };

  if (!todos.data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title")} />
        <input type="submit" />
      </form>
      <ul>
        {todos.data.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            &nbsp;
            <span onClick={() => onUpdate(todo.id, !todo.completed)}>
              [{todo.completed ? "completed" : "not completed"}]
            </span>
            &nbsp;
            <span
              style={{ cursor: "pointer" }}
              onClick={() => onDelete(todo.id)}
            >
              x
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
