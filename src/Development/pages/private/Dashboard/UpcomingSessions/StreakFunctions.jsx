import { API } from 'aws-amplify';

// Function to get the current date in the format "YYYY-MM-DD"
const getCurrentDate = () => {
  const now = new Date(); //globalTime
  return now.toISOString().split('T')[0]; // Extracts the "YYYY-MM-DD" part
};

// Function to fetch the streak count
const fetchStreakCount = async (institutionid) => {
  try {
    const response = await API.get('main', `/user/streak-get/${institutionid}`);

    if (response && response.streak !== undefined && response.level !== undefined) {
      return { 
        streakCount: response.streak, 
        level: response.level, 
        lastCallDate: response.lastCallDate 
      };
    }

    // Default values if response is incomplete
    return { streakCount: 0, level: 0, lastCallDate: null };
  } catch (error) {
    console.error('Error in fetchStreakCount:', error);
    throw error;
  }
};

// Function to update the streak
const updateStreak = async (institutionid, lastCallDate) => {
  const currentDate = getCurrentDate();

  if (!lastCallDate || lastCallDate < currentDate) {
    console.log('Updating streak as last call date is earlier than the current date.');
    const response = await API.put('main', `/user/streak-update/${institutionid}`);
    console.log('Streak updated:', response);
  } else {
    console.log('No update needed as the last call date matches the current date.');
  }
};

// Function to be called when the user leaves a class
const onJoinClass = async (institutionid) => {
  try {
    const { lastCallDate } = await fetchStreakCount(institutionid);
    await updateStreak(institutionid, lastCallDate);
  } catch (error) {
    console.error('Error in onLeaveClass:', error);
    throw error;
  }
};

export { fetchStreakCount, onJoinClass };
