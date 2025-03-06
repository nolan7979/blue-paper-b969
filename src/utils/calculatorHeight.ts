// calcu.tsx
const calcu = (point: number): number => {
  const a = 10 / 6;
  let res = 0;

  if (point < 6) res += (point / 6) * a;
  else if (point < 7) res += a + (point - 6) * 2 * a;
  else if (point < 8) res += 3 * a + (point - 7) * 2 * a;
  else res += 5 * a + ((point - 8) * a) / 2;

  return res * 10;
};

export default calcu;
