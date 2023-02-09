import { format, formatDistanceStrict, formatDistanceToNow } from 'date-fns';

export const fDistanceToNow = (date: Date | string) =>
  formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
export const fDistanceStrict = (date: Date | string) =>
  formatDistanceStrict(typeof date === 'string' ? new Date(date) : date, new Date());

export const fTime = (date: Date | string) => format(new Date(date), 'HH:mm');

export const fDate = (date: Date | string) => format(new Date(date), 'dd/MM/yyyy');

export const fDateTime = (date: Date | string) => format(new Date(date), 'HH:mm, dd/MM/yyyy ');

export const getMinutesBetween = (currentDate?: string, prevDate?: string) => {
  if (!prevDate || !currentDate) {
    return 0;
  }
  const diff = new Date(currentDate).getTime() - new Date(prevDate).getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  return minutes;
};
