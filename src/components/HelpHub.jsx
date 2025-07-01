import React from 'react';
import { HelpHub } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';

const AppHelp = () => {
  // Get or generate user ID
  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = questConfig.USER_ID;
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  // Add error boundary and rate limiting
  try {
    return (
      <div style={{ zIndex: 9999 }}>
        <HelpHub
          uniqueUserId={getUserId()}
          questId={questConfig.QUEST_HELP_QUESTID}
          accent={questConfig.PRIMARY_COLOR}
          botLogo={{
            logo: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png'
          }}
        />
      </div>
    );
  } catch (error) {
    console.warn('Quest SDK HelpHub failed to load:', error);
    // Return nothing if Help Hub fails to load
    return null;
  }
};

export default AppHelp;