/** Function to generate an array of numbers from min to max
 * Example: range(1, 5) => [1, 2, 3, 4, 5]
 */
export const range = (min: number, max: number): number[] =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i)
