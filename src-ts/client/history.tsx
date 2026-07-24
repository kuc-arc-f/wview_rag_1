
import React, { useState , useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Plus } from 'lucide-react';
import { marked } from 'marked';
import Head from '../components/Head';

import { TodoItem } from './history/TodoItem';
import { TodoDialog } from './history/TodoDialog';
import { Todo } from './history/types';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      const sendData = {
        action: "history_list",
        data: ""
      }
      const sendJson = JSON.stringify(sendData)
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          console.log("resp=" + resp)
          if(resp){
            const target = JSON.parse(resp)
            const data = JSON.parse(target.data)
            console.log(data)
            setTodos(data)
          }
          window.chrome.webview.removeEventListener('message', eventHandler);
        }
        window.chrome.webview.addEventListener('message', eventHandler);
        window.chrome.webview.postMessage(sendJson);        
      }                
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };  
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleToggleComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleComplete(id);
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm("Delete , OK ?") === false){
      return;
    }
    console.log("id=", id);
    const deleteItem = {
      id: Number(id),
    };
    const sendData = {
      action: "history_delete",
      data: JSON.stringify(deleteItem)
    }
    console.log(sendData)
    const sendJson = JSON.stringify(sendData)
    if (window.chrome && window.chrome.webview) {
      const eventHandler = (event) => {
        const resp = event.data;
        console.log("resp=" + resp)
        if(resp){
          const target = JSON.parse(resp)
          console.log(target)
          fetchTodos();
        }
        window.chrome.webview.removeEventListener('message', eventHandler);
        setIsLoading(false);        
      }
      window.chrome.webview.addEventListener('message', eventHandler);
      window.chrome.webview.postMessage(sendJson);        
    }    

    //if (selectedTodoId === id) {
    // setSelectedTodoId(null);
    //}
  };

  const selectedTodo = todos.find(t => t.id === selectedTodoId) || null;

  return (
  <>
    <Head />
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">History</h1>
        </div>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">You have no tasks yet.</p>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onClick={() => setSelectedTodoId(todo.id)}
                onToggle={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      <TodoDialog
        todo={selectedTodo}
        onClose={() => setSelectedTodoId(null)}
        onToggleComplete={toggleComplete}
      />
    </div>
  </>  
  );
}
