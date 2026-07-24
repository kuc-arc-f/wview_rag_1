import React from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { Todo } from './types';

interface TodoItemProps {
  todo: Todo;
  onClick: () => void;
  onToggle: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onClick, onToggle, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-start sm:items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
        todo.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >      
      <div className={`flex-1 min-w-0 ${todo.completed ? 'opacity-50' : ''}`}>
        <h3 className={`text-base sm:text-lg font-medium truncate transition-colors ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {todo.input}
        </h3>
        {todo.id && (
          <p className="text-sm text-gray-500 truncate mt-0.5">ID: {todo.id}</p>
        )}        
        {/*
        {todo.description && (
          <p className="text-sm text-gray-500 truncate mt-0.5">{todo.description}</p>
        )}
        */}
      </div>

      <button
        onClick={(e) => onDelete(e, todo.id)}
        className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
