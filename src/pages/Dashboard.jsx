import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTask } from '../context/TaskContext';
import { useJournal } from '../context/JournalContext';
import TaskCard from '../components/TaskCard';
import StatsCard from '../components/StatsCard';

const { FiPlus, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp, FiFolder, FiBookOpen, FiHeart } = FiIcons;

const Dashboard = () => {
  const { tasks, getTasksByCategory } = useTask();
  const { entries, getEntryStats } = useJournal();
  
  const tasksByCategory = getTasksByCategory();
  const journalStats = getEntryStats();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    overdue: tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length
  };

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(task => !task.completed && task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Get category stats
  const categoryStats = Object.entries(tasksByCategory)
    .map(([category, categoryTasks]) => ({
      category,
      total: categoryTasks.length,
      completed: categoryTasks.filter(task => task.completed).length,
      completionRate: categoryTasks.length > 0 
        ? Math.round((categoryTasks.filter(task => task.completed).length / categoryTasks.length) * 100) 
        : 0
    }))
    .filter(stat => stat.total > 0)
    .slice(0, 4);

  // Recent journal entries
  const recentEntries = entries
    .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))
    .slice(0, 3);

  // Get mood distribution for the week
  const getWeeklyMoodDistribution = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentMoods = entries
      .filter(entry => {
        const entryDate = new Date(entry.createdAt || entry.created_at);
        return entryDate >= weekAgo && entry.mood;
      })
      .reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {});

    return recentMoods;
  };

  const weeklyMoods = getWeeklyMoodDistribution();
  const dominantMood = Object.keys(weeklyMoods).reduce((a, b) => 
    weeklyMoods[a] > weeklyMoods[b] ? a : b, Object.keys(weeklyMoods)[0]
  ) || 'neutral';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Let's build momentum with your tasks and journal.
          </p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2"
          >
            <SafeIcon icon={FiBookOpen} className="w-5 h-5" />
            <span>New Entry</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>New Task</span>
          </motion.button>
        </div>
      </div>

      {/* Main Stats - Enhanced with Journal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={FiCheckCircle}
          color="purple"
          trend="+12%"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={FiCheckCircle}
          color="green"
          trend="+8%"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={FiClock}
          color="yellow"
          trend="-3%"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          icon={FiAlertCircle}
          color="red"
          trend="-15%"
        />
        <StatsCard
          title="Journal Entries"
          value={journalStats.totalEntries}
          icon={FiBookOpen}
          color="blue"
          trend="+25%"
        />
        <StatsCard
          title="Moods Tracked"
          value={journalStats.moodEntries}
          icon={FiHeart}
          color="pink"
          trend="+18%"
        />
      </div>

      {/* Journal Insights */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Journal Insights
            </h2>
            <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weekly Mood */}
            <div className="text-center">
              <div className="text-4xl mb-2">
                {dominantMood === 'happy' && '😊'}
                {dominantMood === 'excited' && '🎉'}
                {dominantMood === 'calm' && '😌'}
                {dominantMood === 'focused' && '🎯'}
                {dominantMood === 'stressed' && '😰'}
                {dominantMood === 'neutral' && '😐'}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                {dominantMood || 'No mood'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This week's dominant mood
              </p>
            </div>

            {/* Recent Activity */}
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {entries.filter(entry => {
                  const entryDate = new Date(entry.createdAt || entry.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return entryDate >= weekAgo;
                }).length}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Entries This Week
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep up the momentum!
              </p>
            </div>

            {/* Favorite Entries */}
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                {journalStats.favoriteEntries}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Entries
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Special moments saved
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Overview */}
      {categoryStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Category Overview
            </h2>
            <SafeIcon icon={FiFolder} className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map((stat, index) => (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {stat.category}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.completionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>{stat.completed}/{stat.total} completed</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.completionRate}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Tasks
            </h2>
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <TaskCard key={task.id} task={task} compact />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No tasks yet. Create your first task to get started!
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Deadlines
            </h2>
            <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <TaskCard key={task.id} task={task} compact showDueDate />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No upcoming deadlines
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Journal Entries */}
      {recentEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Journal Entries
            </h2>
            <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {entry.title && (
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
                    {entry.title}
                  </h3>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                  {entry.content}
                </p>
                <div className="flex items-center justify-between">
                  {entry.mood && (
                    <span className="text-lg">
                      {entry.mood === 'happy' && '😊'}
                      {entry.mood === 'excited' && '🎉'}
                      {entry.mood === 'calm' && '😌'}
                      {entry.mood === 'focused' && '🎯'}
                      {entry.mood === 'stressed' && '😰'}
                      {entry.mood === 'neutral' && '😐'}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.createdAt || entry.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;