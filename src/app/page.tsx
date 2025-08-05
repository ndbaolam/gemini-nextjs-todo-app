'use client';

import { useState, useEffect } from 'react';

interface Todo {
  _id: string;
  task: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = async () => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task, completed: false }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTask('');
  };

  const updateTodo = async (id: string, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      }
    );
    setTodos(
      todos.map((todo) => (todo._id === id ? { ...todo, completed } : todo))
    );
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white p-2">
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => updateTodo(todo._id, e.target.checked)}
              className="mr-2"
            />
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.task}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="bg-red-500 text-white p-1 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
