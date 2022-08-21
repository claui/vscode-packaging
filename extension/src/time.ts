const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat([], {
  dateStyle: "long",
  timeStyle: "long",
});

export const getCurrentTimestamp = () => {
  return dateTimeFormat.format(new Date());
};

export const sleep = (duration_ms: number) =>
  new Promise((resolve) => setTimeout(resolve, duration_ms));
