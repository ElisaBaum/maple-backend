export const addMs = (date: Date, ms: number) => new Date(date.getTime() + ms);
export const minutes = (minutes: number) => ({
  inSeconds() { return minutes * 60; },
  inMs() { return this.inSeconds() * 1000; },
});
