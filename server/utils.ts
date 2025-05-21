/**
 * Utility functions for the server
 */

/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/&/g, '-and-')        // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')      // Remove all non-word characters
    .replace(/\-\-+/g, '-')        // Replace multiple - with single -
    .replace(/^-+/, '')            // Trim - from start of text
    .replace(/-+$/, '');           // Trim - from end of text
}

/**
 * Gets a random element from an array
 * @param array The array to get a random element from
 * @returns A random element from the array
 */
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min The minimum value
 * @param max The maximum value
 * @returns A random integer between min and max
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}