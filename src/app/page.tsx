'use client';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { useState } from 'react';
export default function Home() {
  return (
    <div className="h-screen flex justify-center ">
      <Todos />
    </div>
  );
}

const todos = [
  {
    id: 1,
    title: 'Learn React',
    completed: true,
  },
  {
    id: 2,
    title: 'Learn Next.js',
    completed: false,
  },
  {
    id: 3,
    title: 'Learn TypeScript',
    completed: false,
  },
];

function Todos() {
  const [todosList, setTodosList] = useState(todos);

  function addTodo() {
    setTodosList((prev) => [
      ...prev,
      {
        id: Math.random(),
        title: 'New Todo' + (todosList.length + 1),
        completed: false,
      },
    ]);
  }

  function deleteTodo(id) {
    setTodosList(todosList.filter((todo) => todo.id !== id));
  }

  return (
    <div className="w-96 ">
      <h1 className="text-2xl font-bold">Todos</h1>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded my-2 "
        onClick={addTodo}
      >
        Add
      </button>
      <table className="mt-8 w-full">
        <thead>
          <tr>
            <th>Todo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="relative">
          <AnimatePresence initial={false}>
            {todosList.map((todo) => (
              <Todo todo={todo} key={todo.id} deleteTodo={deleteTodo} />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

function Todo({ todo, deleteTodo }: any) {
  let isPresent = useIsPresent();
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: isPresent ? 'relative' : 'absolute',
      }}
      layout
      className="w-full"
    >
      <td className="text-center w-1/2">{todo.title}</td>
      <td className="text-center w-1/2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={deleteTodo.bind(null, todo.id)}
        >
          Delete
        </button>
      </td>
    </motion.tr>
  );
}
