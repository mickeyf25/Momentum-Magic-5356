import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTask } from '../context/TaskContext';

const { FiCheck, FiClock, FiEdit, FiTrash2, FiFlag } = FiIcons;

const TaskCard = ({ task, compact = false, showDueDate = false, onEdit }) => {
  const { toggleTask, deleteTask } = useTask();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && !task.completed && 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000);

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <button
          onClick={() => toggleTask(task.id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
          }`}
        >
          {task.completed && <SafeIcon icon={FiCheck} className="w-3 h-3" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${
            task.completed
              ? 'text-gray-500 dark:text-gray-400 line-through'
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </p>
          {showDueDate && task.dueDate && (
            <p className={`text-xs mt-1 ${
              isOverdue
                ? 'text-red-500'
                : isDueSoon
                ? 'text-yellow-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              Due: {formatDate(task.dueDate)}
            </p>
          )}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="task-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => toggleTask(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
            }`}
          >
            {task.completed && <SafeIcon icon={FiCheck} className="w-4 h-4" />}
          </button>
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${
              task.completed
                ? 'text-gray-500 dark:text-gray-400 line-through'
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
            <SafeIcon icon={FiFlag} className="w-3 h-3" />
            <span className="capitalize">{task.priority}</span>
          </div>
          {task.category && (
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
              {task.category}
            </div>
          )}
        </div>
        {task.dueDate && (
          <div className={`flex items-center space-x-1 text-xs ${
            isOverdue
              ? 'text-red-500'
              : isDueSoon
              ? 'text-yellow-500'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            <SafeIcon icon={FiClock} className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;