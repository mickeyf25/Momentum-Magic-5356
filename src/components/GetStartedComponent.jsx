import React from 'react';
import { GetStarted } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';

const GetStartedComponent = () => {
  // Get or generate user ID
  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = questConfig.USER_ID;
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  // Add error boundary for Quest SDK
  try {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <GetStarted
          questId={questConfig.GET_STARTED_QUESTID}
          uniqueUserId={getUserId()}
          accent={questConfig.PRIMARY_COLOR}
          autoHide={false}
        >
          <GetStarted.Header />
          <GetStarted.Progress />
          <GetStarted.Content />
          <GetStarted.Footer />
        </GetStarted>
      </div>
    );
  } catch (error) {
    console.warn('Quest SDK GetStarted component failed to load:', error);
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Momentum Magic!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your journey to better productivity starts here. Create your first task or journal entry to begin building momentum.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <span className="text-gray-900 dark:text-white">Create your first task</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <span className="text-gray-900 dark:text-white">Write your first journal entry</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <span className="text-gray-900 dark:text-white">Track your progress in analytics</span>
          </div>
        </div>
      </div>
    );
  }
};

export default GetStartedComponent;