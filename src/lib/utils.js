import { proxy, subscribe } from 'valtio';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const STORAGE_VERSION = 0.1;

export function createStorageProxy(key, defaultValue) {
  const state = proxy(getStoredValue(key, defaultValue));

  subscribe(state, () => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ ...state, __version: STORAGE_VERSION })
      );
    } catch (error) {
      console.error(`Could not persist state: ${error.message}`);
    }
  });

  return state;
}

function getStoredValue(key, defaultValue) {
  try {
    const storageItem = localStorage.getItem(key);

    if (storageItem) {
      const parsedItem = JSON.parse(storageItem);

      if (parsedItem.__version >= STORAGE_VERSION) {
        return parsedItem;
      } else {
        // Overwrite the saved state
        localStorage.setItem(key, JSON.stringify(defaultValue));

        return defaultValue;
      }
    }
  } catch {
    console.warn('Could not parse local storage value');
  }

  return defaultValue;
}

export function reverseObject(obj) {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[value] = key;
    return result;
  }, {});
}

export function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
