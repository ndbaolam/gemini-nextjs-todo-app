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
    if (!task) return;
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
    await fetch(`/api/todos/${id}`,
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">My Todos</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => updateTodo(todo._id, e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span
                className={`flex-grow mx-4 text-gray-700 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                {todo.task}
              </span>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
