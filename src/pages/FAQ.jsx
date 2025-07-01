import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronDown, FiChevronRight, FiHelpCircle, FiCheckSquare, FiBookOpen, FiBarChart3, FiSettings } = FiIcons;

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqSections = [
    {
      title: 'Getting Started',
      icon: FiHelpCircle,
      color: 'purple',
      questions: [
        {
          question: 'What is Momentum Magic?',
          answer: 'Momentum Magic is a comprehensive productivity platform that combines task management, personal journaling, and analytics to help you build momentum and achieve your goals. It\'s designed to be your all-in-one companion for personal productivity and self-reflection.'
        },
        {
          question: 'How do I create my first task?',
          answer: 'Click the "New Task" button from the dashboard or tasks page. Fill in the task title, description, category, priority level, and due date. You can also create custom categories to organize your tasks exactly how you want.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes! Your data is stored securely using enterprise-grade encryption. We support both cloud storage through Supabase and local storage as a fallback. Your personal information and journal entries are never shared with third parties.'
        },
        {
          question: 'Can I use Momentum Magic offline?',
          answer: 'Yes, Momentum Magic works offline using local storage. When you\'re back online, your data will sync automatically if you have cloud storage configured.'
        }
      ]
    },
    {
      title: 'Task Management',
      icon: FiCheckSquare,
      color: 'green',
      questions: [
        {
          question: 'How do I organize my tasks?',
          answer: 'Tasks can be organized by categories (Work, Personal, Health, etc.), priority levels (High, Medium, Low), and due dates. You can create custom categories and use the filter and sort options to view tasks exactly how you prefer.'
        },
        {
          question: 'What happens to overdue tasks?',
          answer: 'Overdue tasks are automatically highlighted in red and appear in the "Overdue" filter. They\'re also prominently displayed on your dashboard to help you prioritize catching up on missed deadlines.'
        },
        {
          question: 'Can I set recurring tasks?',
          answer: 'Currently, Momentum Magic focuses on individual task completion. For recurring activities, we recommend creating new tasks as needed or using the duplicate feature to quickly recreate similar tasks.'
        },
        {
          question: 'How do I track my task completion progress?',
          answer: 'Your task completion progress is automatically tracked and displayed in the Analytics section. You can see completion rates by category, priority distribution, and weekly progress trends.'
        }
      ]
    },
    {
      title: 'Personal Journal',
      icon: FiBookOpen,
      color: 'blue',
      questions: [
        {
          question: 'What can I track in my journal?',
          answer: 'Your journal supports rich text entries, mood tracking (happy, excited, calm, focused, stressed, neutral), custom tags for organization, and a favorites system to mark special entries. You can also add optional titles to your entries.'
        },
        {
          question: 'How does mood tracking work?',
          answer: 'When creating a journal entry, you can select from six different moods with emoji representations. Your mood data is then analyzed in the analytics section to show patterns and trends over time, helping you understand your emotional journey.'
        },
        {
          question: 'Can I search through my journal entries?',
          answer: 'Yes! You can search through entry titles, content, and tags. The search is instant and works across all your entries. You can also filter by favorites, entries with moods, or tagged entries.'
        },
        {
          question: 'What are tags and how do I use them?',
          answer: 'Tags are custom labels you can add to journal entries to categorize and organize them. For example, you might use tags like "work", "family", "goals", or "gratitude". Tags make it easy to find related entries later.'
        },
        {
          question: 'How do I mark entries as favorites?',
          answer: 'When creating or editing a journal entry, you can toggle the "Mark as favorite" switch. Favorite entries can be quickly accessed using the favorites filter and are highlighted in your journal list.'
        }
      ]
    },
    {
      title: 'Analytics & Insights',
      icon: FiBarChart3,
      color: 'pink',
      questions: [
        {
          question: 'What analytics are available?',
          answer: 'Momentum Magic provides comprehensive analytics including task completion rates, category distribution, priority analysis, weekly progress trends, mood distribution over time, and journal entry statistics.'
        },
        {
          question: 'How often is analytics data updated?',
          answer: 'Analytics data is updated in real-time as you complete tasks and add journal entries. Charts and statistics reflect your current data immediately.'
        },
        {
          question: 'Can I export my analytics data?',
          answer: 'Currently, analytics are displayed within the app. We\'re working on export features for future releases. Your raw data is always accessible through your account.'
        },
        {
          question: 'What insights can I gain from mood tracking?',
          answer: 'Mood tracking helps you identify patterns in your emotional well-being, correlate moods with activities or time periods, and track your overall emotional journey over time. The analytics show your mood distribution and trends.'
        }
      ]
    },
    {
      title: 'Settings & Customization',
      icon: FiSettings,
      color: 'yellow',
      questions: [
        {
          question: 'How do I change my theme?',
          answer: 'You can switch between light, dark, and system themes in the Settings page. The system option automatically matches your device\'s theme preference.'
        },
        {
          question: 'Can I customize categories?',
          answer: 'Yes! When creating tasks, you can add custom categories. The app starts with default categories (Work, Personal, Health, Education, Shopping) but you can create as many custom categories as you need.'
        },
        {
          question: 'How do I manage notifications?',
          answer: 'Notification preferences can be configured in the Settings page. You can control email notifications, push notifications, and task reminders according to your preferences.'
        },
        {
          question: 'Can I change my language?',
          answer: 'Language settings are available in the Settings page. Currently, we support English, Spanish, French, and German, with more languages being added regularly.'
        }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
      green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      pink: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20',
      yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
    };
    return colors[color] || colors.purple;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find answers to common questions about Momentum Magic. If you can't find what you're looking for, 
          use our Help Hub for personalized assistance.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-6">
        {faqSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getColorClasses(section.color)}`}>
                  <SafeIcon icon={section.icon} className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* Questions */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {section.questions.map((item, itemIndex) => {
                const itemKey = `${sectionIndex}-${itemIndex}`;
                const isOpen = openItems[itemKey];

                return (
                  <div key={itemIndex}>
                    <button
                      onClick={() => toggleItem(itemKey)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-4">
                          {item.question}
                        </h3>
                        <SafeIcon
                          icon={isOpen ? FiChevronDown : FiChevronRight}
                          className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200"
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-8 text-center border border-purple-200 dark:border-purple-800"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4">
          <SafeIcon icon={FiHelpCircle} className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Still Need Help?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
          Can't find the answer you're looking for? Our Help Hub provides personalized assistance 
          and can guide you through any feature or question you might have.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          Open Help Hub
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FAQ;