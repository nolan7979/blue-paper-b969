// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
module.exports = {
  i18n: {
    locales: [
      'vi', // Vietnamese (1st)
      'en', // English (2nd)
      'en-GB', // English (United Kingdom) (3rd)
      'de', // German (4th)
      'pt', // Portuguese  (5th)
      'it', // Italian (6th)
      'pt-BR', // Brazilian Portuguese (7th)
      'es', // Spanish  (8th)
      'fr', // French (9th)
      'id', // Indonesian (10th)
      'hi', // Hindi  (11th)
      'tr', // Turkish  (12th)
      'ms', // Malay  (13th)
      'bn', // Bengali  (14th)
      'hr', // Croatian (15th)
      'nl', // Dutch (Netherlands)  (16th)
      'pl', // Polish (Poland)  (17th)
      'el', // Greek (18th)
      'ar-XA', // Arabic (Saudi Arabia)  (19th)
      'ko', // Korean (20th)
      'th', // Thai (21st)
      'zh-CN', // Chinese (Simplified) (22nd)
      'ja', // Japanese (23rd)
      'en-PH', // English (Philippines) (24th)
      'en-SG', // English (Singapore) (25th)
      'en-IN', // English (India) (26th)
      'ru', // Russian (27th)
      'uk', // Ukrainian (28th)
    ],
    defaultLocale: 'en',
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
};
