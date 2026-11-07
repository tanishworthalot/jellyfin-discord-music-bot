import { formatPosition, parseSeekAmount } from './seek.util';

describe('parseSeekAmount', () => {
  it.each([
    ['5', 5000],
    ['5s', 5000],
    ['90s', 90000],
    ['2m', 120000],
    ['1m30s', 90000],
    ['1m 30s', 90000],
    ['0.5m', 30000],
    ['10S', 10000],
    ['  15s  ', 15000],
  ])('parses %s', (input, expected) => {
    expect(parseSeekAmount(input)).toBe(expected);
  });

  it.each(['', 'abc', '0', '0s', '-5s', '5x', 's', 'm', '5m5m'])(
    'rejects %j',
    (input) => {
      expect(parseSeekAmount(input)).toBeUndefined();
    },
  );
});

describe('formatPosition', () => {
  it('formats minutes and seconds', () => {
    expect(formatPosition(65000)).toBe('1:05');
    expect(formatPosition(0)).toBe('0:00');
  });

  it('formats hours', () => {
    expect(formatPosition(3_725_000)).toBe('1:02:05');
  });
});
