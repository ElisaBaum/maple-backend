export const addMs = (date: Date, ms: number) => new Date(date.getTime() + ms);
export const minutes = (min: number) => ({
  inSeconds() { return min * 60; },
  inMs() { return this.inSeconds() * 1000; },
});
