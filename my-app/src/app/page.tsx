"use client";
import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    } else {
      // Default todos
      const defaultTodos: Todo[] = [
        { id: 1, text: 'Learn Next.js', completed: false },
        { id: 2, text: 'Explore Tailwind CSS', completed: false },
        { id: 3, text: 'Build a To-Do App', completed: false },
      ];
      setTodos(defaultTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addOrUpdateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    if (editId !== null) {
      setTodos(todos.map(todo => todo.id === editId ? { ...todo, text: input } : todo));
      setEditId(null);
    } else {
      const newTodo: Todo = { id: Date.now(), text: input, completed: false };
      setTodos([...todos, newTodo]);
    }

    setInput('');
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleCompletion = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const startEditing = (id: number) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setInput(todoToEdit.text);
      setEditId(id);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gradient-to-r from-blue-200 to-green-200 min-h-screen">
      <h1 className="text-3xl font-serif text-center mb-4">To-Do List</h1>
      <form onSubmit={addOrUpdateTodo} className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-grow rounded-lg shadow-lg"
          placeholder="Add a new task"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 ml-2 rounded-lg shadow-lg">
          {editId !== null ? 'Update' : 'Add'}
        </button>
      </form>
      <ul className="list-disc pl-5">
        {todos.map(todo => (
          <li key={todo.id} className={`flex items-center mb-2 p-2 rounded-lg shadow ${todo.completed ? 'bg-green-100 line-through text-gray-500' : 'bg-white'}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompletion(todo.id)}
              className="mr-2"
            />
            <span
              onClick={() => toggleCompletion(todo.id)}
              className={`cursor-pointer ${todo.completed ? 'text-gray-500' : 'text-black'}`}
            >
              {todo.text}
            </span>
            <div className="ml-auto">
              <button onClick={() => startEditing(todo.id)} className="text-blue-500 mr-2">
                Edit
              </button>
              <button onClick={() => removeTodo(todo.id)} className="text-red-500">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
