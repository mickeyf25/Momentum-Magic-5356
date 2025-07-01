import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useJournal } from '../context/JournalContext';

const { FiEdit, FiTrash2, FiClock, FiTag, FiBookmark } = FiIcons;

const JournalEntry = ({ entry, onEdit }) => {
  const { deleteEntry, toggleFavorite } = useJournal();

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      excited: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
      calm: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      focused: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
      stressed: 'text-red-500 bg-red-50 dark:bg-red-900/20',
      neutral: 'text-gray-500 bg-gray-50 dark:bg-gray-800'
    };
    return colors[mood] || colors.neutral;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <SafeIcon icon={FiClock} className="w-4 h-4" />
            <span>{formatDate(entry.createdAt || entry.created_at)}</span>
          </div>
          {entry.isFavorite && (
            <SafeIcon icon={FiBookmark} className="w-4 h-4 text-purple-500" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteEntry(entry.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {entry.title && (
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
          {entry.title}
        </h3>
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
        {entry.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {entry.mood && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
              {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
            </div>
          )}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiTag} className="w-3 h-3 text-gray-400" />
              <div className="flex space-x-1">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => toggleFavorite(entry.id)}
          className={`p-1 rounded transition-colors ${
            entry.isFavorite
              ? 'text-purple-500 hover:text-purple-600'
              : 'text-gray-400 hover:text-purple-500'
          }`}
        >
          <SafeIcon icon={FiBookmark} className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default JournalEntry;