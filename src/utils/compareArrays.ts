import { isEqual } from "lodash";

export const areMatchesEqual = (
  arr1: Record<string, any>[],
  arr2: Record<string, any>[]
) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (!isEqual(arr1[i], arr2[i])) return false;
  }
  return true;
};
