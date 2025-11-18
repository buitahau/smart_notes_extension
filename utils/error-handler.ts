import axios from 'axios';

/**
 * Helper function to handle API errors consistently across the application
 * @param error - The error object from a try-catch block
 * @returns A user-friendly error message string
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Handle axios-specific errors
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      return 'Network error: Unable to connect to server';
    } else {
      // Something else happened
      return error.message || 'Request configuration error';
    }
  }

  // Handle non-axios errors
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred';
};
