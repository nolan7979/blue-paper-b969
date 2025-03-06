// memoryCache.ts
const memoryCache: { [key: string]: any } = {};

export const getCache = (key: string) => memoryCache[key];
export const setCache = (key: string, value: any, duration: number) => {
  memoryCache[key] = value;
  setTimeout(() => delete memoryCache[key], duration);
};
