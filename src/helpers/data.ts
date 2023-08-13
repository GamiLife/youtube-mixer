/**
 * Template to format time element
 * @param value
 * @returns
 */
const template = (value: number) =>
  Math.floor(Number(value)).toString().padStart(2, '0');

/**
 * Transform seconds to this format: hh:mm:ss
 * @param seconds
 * @returns
 */
export const getTimeFormatBySeconds = (seconds: number) => {
  let rest = seconds;

  const hh = template(rest / 3600);
  rest = rest % 3600;

  const mm = template(rest / 60);
  rest = rest % 60;

  const ss = template(rest);

  return `${hh}:${mm}:${ss}`;
};
