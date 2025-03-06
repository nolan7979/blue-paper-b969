// utils/userAgent.js
import UAParser from 'ua-parser-js';

export const getUserAgent = () => {
  const uaParser = new UAParser();
  return uaParser.getOS();
};
