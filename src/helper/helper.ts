export const dateFormatter = (
  date: {
    start: { day: number; month: number; year: number };
    end: { day: number; month: number; year: number };
  },
  time: { hour: number; minute: number },
) => {
  return {
    start: `${date.start.month}/${date.start.day}/${date.start.year} ${time.hour}:${time.minute}`,
    end: `${date.end.month}/${date.end.day}/${date.end.year} ${time.hour}:${time.minute}`,
  };
};
