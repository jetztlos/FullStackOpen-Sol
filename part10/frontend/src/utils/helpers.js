// part10/frontend/src/utils/helpers.js

export const parseStatistics = (value) => {
  return value >= 1000
  ? `${Math.round(value / 100) / 10}k`
  : String(value);
};

export const parseDate = (dateString) => {
  const dateObject = new Date(dateString);

  const date = ('0' + dateObject.getDate()).slice(-2);

  const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
  
  const year = dateObject.getFullYear();

  return [date, month, year].join('-');
};
