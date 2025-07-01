import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import GetStartedComponent from '../components/GetStartedComponent';

const { FiCheckSquare, FiBookOpen, FiBarChart3, FiTarget, FiHeart, FiTrendingUp, FiPlus, FiEdit } = FiIcons;

const GetStartedPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FiCheckSquare,
      title: 'Smart Task Management',
      description: 'Organize tasks by categories, set priorities, and track deadlines with an intuitive interface.',
      color: 'purple'
    },
    {
      icon: FiBookOpen,
      title: 'Personal Journal',
      description: 'Capture thoughts, track moods, and reflect on your journey with our comprehensive journaling system.',
      color: 'blue'
    },
    {
      icon: FiBarChart3,
      title: 'Analytics & Insights',
      description: 'Visualize your productivity patterns and mood trends with detailed charts and statistics.',
      color: 'green'
    },
    {
      icon: FiTarget,
      title: 'Goal Tracking',
      description: 'Set meaningful goals and track your progress with our momentum-building approach.',
      color: 'pink'
    }
  ];

  const journalFeatures = [
    {
      icon: FiHeart,
      title: 'Mood Tracking',
      description: 'Track your emotional journey with our mood selection feature and see patterns over time.'
    },
    {
      icon: FiTarget,
      title: 'Smart Tags',
      description: 'Organize entries with custom tags for easy searching and categorization.'
    },
    {
      icon: FiTrendingUp,
      title: 'Favorites System',
      description: 'Mark special entries as favorites to quickly access your most meaningful moments.'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      pink: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20'
    };
    return colors[color] || colors.purple;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Momentum Magic
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Your all-in-one productivity companion for task management, personal journaling, and progress tracking. 
          Build momentum and achieve your goals with our comprehensive suite of tools.
        </p>
      </div>

      {/* Interactive Onboarding */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <GetStartedComponent />
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${getColorClasses(feature.color)}`}>
                <SafeIcon icon={feature.icon} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Journal Deep Dive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-8 shadow-sm border border-blue-200 dark:border-blue-800"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            <SafeIcon icon={FiBookOpen} className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Your Personal Journal
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            More than just writing - our journal feature helps you track your emotional journey, 
            organize thoughts with smart tags, and gain insights into your personal growth patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <SafeIcon icon={feature.icon} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Getting Started Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Ready to Build Momentum?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Create Your First Task
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Start by adding your first task with a category, priority, and due date.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/tasks')}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Create Task</span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Write Your First Entry
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Capture your thoughts and track your mood in your personal journal.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/journal')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <SafeIcon icon={FiEdit} className="w-4 h-4" />
              <span>Start Journal</span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-green-600 dark:text-green-400">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Track Your Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Watch your analytics grow and see patterns in your productivity and mood.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/analytics')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <SafeIcon icon={FiBarChart3} className="w-4 h-4" />
              <span>View Analytics</span>
            </motion.button>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            Go to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GetStartedPage;