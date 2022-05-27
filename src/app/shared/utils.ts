export const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const isArrayOfStrings = (value: unknown): boolean => {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
};

export const isNonEmptyArrayOfStrings = (value: unknown): boolean => {
  return Array.isArray(value) && value.length > 0 && value.every(item => typeof item === 'string');
};
