import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Circle } from 'lucide-react';
import { Todo } from './types';
import { marked } from 'marked';

interface TodoDialogProps {
  todo: Todo | null;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}

export function TodoDialog({ todo, onClose, onToggleComplete }: TodoDialogProps) {
  if(todo){
    const targetHtml = marked.parse(todo.content);
    todo.content = targetHtml
  }
  console.log(todo)
  return (
    <AnimatePresence>
      {todo && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-start p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 pr-4 leading-tight">{todo.input}</h2>
              <button 
                onClick={onClose} 
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">AI:</h3>
                {todo.content ? (
                  <span className="text-gray-900" dangerouslySetInnerHTML={{ __html: todo.content }}></span>
                ): <span className="text-gray-400 italic">No description provided.</span>}
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-gray-50 border-t border-gray-100 mt-auto">
              <div className="text-sm text-gray-500">
                Created on {new Date(todo.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
