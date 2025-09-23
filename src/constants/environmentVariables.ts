export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const environmentVariables = {
  apiBaseUrl: API_BASE_URL,
} as const;
