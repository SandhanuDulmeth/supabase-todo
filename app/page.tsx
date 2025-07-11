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

  async function toggleTask(id: number, completed: boolean) {
    setLoading(true);
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id);
    if (error) {
      console.error(error);
    }
    await loadTasks();
  }

  async function deleteTask(id: number) {
    setLoading(true);
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(error);
    }
    await loadTasks();
  }
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Todo List</h1>
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a new task..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </form>
        
        {loading && (
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        )}
        
        <div className="space-y-2">
          {tasks.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-400">
              <p>No tasks yet. Add one above!</p>
            </div>
          )}
          {tasks.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => toggleTask(item.id, item.completed)}
                disabled={loading}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {item.completed && '✓'}
              </button>
              <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {item.task}
              </span>
              <button
                onClick={() => deleteTask(item.id)}
                disabled={loading}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}