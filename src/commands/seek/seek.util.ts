/**
 * Parses a seek amount such as `5`, `5s`, `90s`, `2m`, `1m30s` or `0.5m`
 * into milliseconds. A bare number is treated as seconds.
 *
 * Returns undefined when the input is not a valid amount or is zero.
 */
export const parseSeekAmount = (input: string): number | undefined => {
  const text = input.trim().toLowerCase().replace(/\s+/g, '');

  const match = /^(?:(\d+(?:\.\d+)?)m)?(?:(\d+(?:\.\d+)?)s?)?$/.exec(text);
  if (match === null || text.length === 0) {
    return undefined;
  }

  const [, minutes, seconds] = match;
  const totalMs =
    (minutes !== undefined ? parseFloat(minutes) * 60_000 : 0) +
    (seconds !== undefined ? parseFloat(seconds) * 1000 : 0);

  if (!Number.isFinite(totalMs) || totalMs <= 0) {
    return undefined;
  }

  return Math.round(totalMs);
};

/**
 * Formats milliseconds as m:ss, or h:mm:ss for tracks of an hour or longer.
 */
export const formatPosition = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ss = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${ss}`;
  }
  return `${minutes}:${ss}`;
};
