export function addMs(date: Date, ms: number): Date {
  return new Date(date.getTime() + ms);
}
