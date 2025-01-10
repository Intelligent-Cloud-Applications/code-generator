import { API } from 'aws-amplify';

// Function to get the current date in the format "YYYY-MM-DD"
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Function to get the date of the previous day in the format "YYYY-MM-DD"
const getPreviousDate = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Function to fetch the streak count and potentially reset the streak
const fetchStreakCount = async (institutionid) => {
  try {
    const response = await API.get('main', `/user/streak-get/${institutionid}`);

    // Check if the necessary properties exist in the response
    if (response && response.streak !== undefined && response.level !== undefined) {
      const { lastCallDate } = response;
      const currentDate = getCurrentDate();
      const previousDate = getPreviousDate();

      console.log('Last Call Date:', lastCallDate);
      console.log('Current Date:', currentDate);
      console.log('Previous Date:', previousDate);

      // Logic to reset the streak if necessary
      if (lastCallDate < previousDate) {
        // Reset the streak to 0 if the last call date is less than the previous date
        console.log('Resetting streak as last call date is less than previous date');
        await API.post('main', `/user/reset-streak/${institutionid}`);
        // After reset, update the response to reflect the reset state
        response.streak = 0;
        response.lastCallDate = currentDate;
      }

      // Return the updated response
      return { streakCount: response.streak, level: response.level, lastCallDate: response.lastCallDate };
    }

    // If 'streak' or 'level' is undefined, handle this case accordingly
    return { streakCount: 0, level: 0, lastCallDate: null }; // Default values or handle as needed
  } catch (error) {
    console.error('Error in fetchStreakCount:', error);
    throw error;
  }
};

// Function to update the streak
const updateStreak = async (institutionid, lastCallDate) => {
  const currentDate = getCurrentDate();
  const previousDate = getPreviousDate();

  // Logic to update the streak
  if (!lastCallDate || lastCallDate === previousDate) {
    // Update the streak
    console.log('Updating streak as last call date is null or equal to previous date');
    const response = await API.put('main', `/user/streak-update/${institutionid}`);
    console.log('Streak updated:', response);
  } else if (lastCallDate === currentDate) {
    // Do nothing if the last call date is the same as the current date
    console.log('No update needed as last call date is same as current date');
    return;
  }
};

// Function to be called when the user joins a class
const onJoinClass = async (institutionid) => {
  try {
    const { lastCallDate } = await fetchStreakCount(institutionid);
    await updateStreak(institutionid, lastCallDate);
  } catch (error) {
    console.error('Error in onJoinClass:', error);
    throw error;
  }
};

export { fetchStreakCount, onJoinClass };
