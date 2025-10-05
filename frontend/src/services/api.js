// --- Configuration ---
const BACKEND_URL = 'http://localhost:4000'; // Match the URL from your socket.js

/**
 * Fetches the poll history for a specific session from the backend API.
 * @param {string} sessionId - The ID of the session to fetch history for.
 * @returns {Promise<Array>} A promise that resolves to an array of poll objects.
 */
export const fetchPollHistory = async (sessionId) => {
  // <-- FIX: The function now requires a sessionId -->
  if (!sessionId) {
    console.error('fetchPollHistory requires a sessionId.');
    return []; // Return empty array if no ID is provided
  }
  
  try {
    // <-- FIX: The sessionId is now part of the API endpoint URL -->
    const response = await fetch(`${BACKEND_URL}/api/polls/history/${sessionId}`);
    
    if (!response.ok) {
      // Throw an error that can be caught by the component
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch poll history for session ${sessionId}:`, error);
    // Re-throw the error so the calling component's catch block can handle it
    throw error;
  }
};