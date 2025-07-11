"use client";
import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

export default function Home() {
  type Task = {
    id: number;
    task: string;
    completed: boolean;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: false });
    if (error) {
      console.error(error);
    }
    setTasks(data || []);
    setLoading(false);
  }

  async function addTask(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('todos')
      .insert([{ task: input.trim(), completed: false }]);
    if (error) {
      console.error(error);
    }
    setInput('');
    await loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter task"
          disabled={loading}
          className="border px-2 py-1 rounded flex-1"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {loading && <div className="mb-2 text-gray-500">Loading...</div>}
      <ul>
        {tasks.length === 0 && !loading && (
          <li className="text-gray-400">No tasks yet.</li>
        )}
        {tasks.map(item => (
          <li key={item.id} className="py-1">
            {item.task} {item.completed ? '✅' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}