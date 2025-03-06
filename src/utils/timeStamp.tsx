import { format } from 'date-fns';

import { getDateFromTimestamp } from '@/utils/common-utils';

export function timeStampFormat(timestamp: number, short?: boolean) {
  try {
    const date = getDateFromTimestamp(timestamp);
    const formattedDate = short ? format(date, 'dd/MM') : format(date, 'dd/MM/yyyy');

    const formattedTime = format(date, 'HH:mm');

    return { formattedTime, formattedDate };
  } catch (err) {
    const date = Math.floor(new Date().getTime() / 1000);
    const formattedDate = short ? format(date, 'dd/MM') : format(date, 'dd/MM/yyyy');

    const formattedTime = format(date, 'HH:mm');
    return { formattedTime, formattedDate };
  }
}
