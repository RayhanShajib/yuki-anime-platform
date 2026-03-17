/**
 * SSR-safe localStorage utility
 * 
 * Provides safe wrappers around localStorage API that:
 * - Check for browser environment (typeof window !== 'undefined')
 * - Handle errors gracefully with try/catch
 * - Return sensible defaults when localStorage is unavailable
 * - Work consistently during server-side rendering (SSR)
 */

/**
 * Get the actual localStorage object safely
 * Returns null if not available or not functional
 */
function getLocalStorage(): Storage | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  // Check if window.localStorage exists and is an object
  if (!window.localStorage || typeof window.localStorage !== 'object') {
    return null;
  }

  // Verify it has the required methods
  const storage = window.localStorage;
  if (typeof storage.getItem !== 'function' ||
      typeof storage.setItem !== 'function' ||
      typeof storage.removeItem !== 'function' ||
      typeof storage.clear !== 'function') {
    return null;
  }

  return storage;
}

/**
 * Check if localStorage is available and functional
 */
function isLocalStorageAvailable(): boolean {
  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  // Try to actually use localStorage to make sure it works
  try {
    const testKey = '__localStorage_test__';
    storage.setItem(testKey, 'test');
    const testValue = storage.getItem(testKey);
    storage.removeItem(testKey);
    return testValue === 'test';
  } catch (e) {
    return false;
  }
}

/**
 * Safely get an item from localStorage
 * @param key - The localStorage key
 * @param defaultValue - Default value to return if key doesn't exist or localStorage unavailable
 * @returns The stored value or defaultValue
 */
function getItem(key: string, defaultValue: string | null = null): string | null {
  const storage = getLocalStorage();
  if (!storage) {
    return defaultValue;
  }

  try {
    const value = storage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely get and parse a JSON item from localStorage
 * @param key - The localStorage key
 * @param defaultValue - Default value to return if key doesn't exist or parsing fails
 * @returns The parsed value or defaultValue
 */
function getItemJSON<T>(key: string, defaultValue: T): T {
  const storage = getLocalStorage();
  if (!storage) {
    return defaultValue;
  }

  try {
    const value = storage.getItem(key);
    if (value === null) {
      return defaultValue;
    }
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error reading/parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 * @param key - The localStorage key
 * @param value - The value to store
 * @returns true if successful, false otherwise
 */
function setItem(key: string, value: string): boolean {
  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safely set and stringify a JSON item in localStorage
 * @param key - The localStorage key
 * @param value - The value to store (will be JSON.stringify'd)
 * @returns true if successful, false otherwise
 */
function setItemJSON<T>(key: string, value: T): boolean {
  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing/stringifying localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param key - The localStorage key to remove
 * @returns true if successful, false otherwise
 */
function removeItem(key: string): boolean {
  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safely clear all items from localStorage
 * @returns true if successful, false otherwise
 */
function clear(): boolean {
  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Check if a key exists in localStorage
 * @param key - The localStorage key to check
 * @returns true if the key exists, false otherwise
 */
function hasItem(key: string): boolean {
  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    return storage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Export the safe localStorage utility
 */
export const safeLocalStorage = {
  getItem,
  getItemJSON,
  setItem,
  setItemJSON,
  removeItem,
  clear,
  hasItem,
  isAvailable: isLocalStorageAvailable,
};
