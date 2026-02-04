let counter = 0;

export const nextId = (prefix = 'id') => {
  counter += 1;
  return `${prefix}-${counter}`;
};
