"use client";
import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

type Task = {
  id: number;
  task: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');

  async function loadTasks() {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: false });
    setTasks(data || []);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    
    await supabase
      .from('todos')
      .insert([{ task: input.trim(), completed: false }]);
    
    setInput('');
    loadTasks();
  }

  async function toggleTask(id: number, completed: boolean) {
    await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id);
    loadTasks();
  }

  async function deleteTask(id: number) {
    await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add task..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </form>
      
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-2 p-2 border rounded">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id, task.completed)}
            />
            <span className={task.completed ? 'line-through' : ''}>
              {task.task}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="ml-auto text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}