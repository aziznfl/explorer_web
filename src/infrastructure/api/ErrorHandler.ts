import { reactive } from 'vue';

export interface ApiError {
  message: string;
  status?: number;
  timestamp: string;
}

interface ErrorState {
  errors: ApiError[];
  lastError: ApiError | null;
}

export const errorState = reactive<ErrorState>({
  errors: [],
  lastError: null,
});

export const addError = (message: string, status?: number) => {
  const error: ApiError = {
    message,
    status,
    timestamp: new Date().toISOString(),
  };
  
  errorState.errors.unshift(error);
  errorState.lastError = error;
  
  // Optional: Auto-clear last error after some time
  setTimeout(() => {
    if (errorState.lastError === error) {
      errorState.lastError = null;
    }
  }, 5000);
  
  console.error(`[API Error] ${status ? `(${status}) ` : ''}${message}`);
};

export const clearErrors = () => {
  errorState.errors = [];
  errorState.lastError = null;
};
