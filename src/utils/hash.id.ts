import { isNumber } from 'class-validator';

/**
 * 0 -> 9
 */
const NUMERIC = {
  min: 48,
  max: 57,
};

/**
 * a -> z
 */
const ALPHABET = {
  min: 97,
  max: 122,
};

const OFFSET_CHAR = [3, 1, 5, 9, 6, 2, 4, 7, 8, 0];

export const encode = (id: string | undefined): string => {
  if (id === undefined || id === '') return '';

  if (!shouldEncode()) return id;

  const newId: string[] = [];

  for (let i = 0; i < id.length; i++)
    newId.push(encodeChar(id.charAt(i), OFFSET_CHAR[i % OFFSET_CHAR.length]));

  return newId.join('');
};

export const encodeImage = (id: string | undefined): string => {
  if (id === undefined || id === '') return '';

  const newId: string[] = [];

  for (let i = 0; i < id.length; i++)
    newId.push(encodeChar(id.charAt(i), OFFSET_CHAR[i % OFFSET_CHAR.length]));

  return newId.join('');
};

export const decode = (id: string | undefined): string => {
  if (id === undefined || id === '') return '';

  const newId: string[] = [];

  for (let i = 0; i < id.length; i++)
    newId.push(decodeChar(id[i], OFFSET_CHAR[i % OFFSET_CHAR.length]));

  return newId.join('');
};

function encodeChar(char: string, offset: number): string {
  const CHARTYPE = isNumber(Number(char)) ? NUMERIC : ALPHABET;
  const code = char.charCodeAt(0) + offset;

  if (code <= CHARTYPE.max) return String.fromCharCode(code);

  const dis = Math.abs(CHARTYPE.max - code);

  return String.fromCharCode(CHARTYPE.min + dis - 1);
}

function decodeChar(char: string, offset: number): string {
  const CHARTYPE = isNumber(Number(char)) ? NUMERIC : ALPHABET;
  const code = char.charCodeAt(0) - offset;

  if (code >= CHARTYPE.min) return String.fromCharCode(code);

  const dis = Math.abs(CHARTYPE.min - code);

  return String.fromCharCode(CHARTYPE.max - dis + 1);
}

function shouldEncode(): boolean {
  if (process.env.NEXT_PUBLIC_API_BASE_URL?.includes('https://devapi'))
    return true;
  return true;
}

export const decodeLinkForDev = (id: string | undefined): string => {
  if (id === undefined || id === '') return '';

  if (shouldEncode()) return id;

  const newId: string[] = [];

  for (let i = 0; i < id.length; i++)
    newId.push(decodeChar(id[i], OFFSET_CHAR[i % OFFSET_CHAR.length]));

  return newId.join('');
};

export const encodeLinkForPro = (id: string | undefined): string => {
  if (id === undefined || id === '') return '';

  if (!shouldEncode()) return id;

  const newId: string[] = [];

  for (let i = 0; i < id.length; i++)
    newId.push(encodeChar(id[i], OFFSET_CHAR[i % OFFSET_CHAR.length]));

  return newId.join('');
};
