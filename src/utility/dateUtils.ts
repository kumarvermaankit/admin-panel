import moment from 'moment';

export const formatLocalDate = (date: string): string => {
  return moment(date).local().format("DD-MM-YYYY");
};