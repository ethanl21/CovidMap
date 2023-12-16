export const flipObject = (data: object) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));
