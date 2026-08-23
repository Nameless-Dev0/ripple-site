// Shared helper for the cutoff/bandwidth fields.
//
// The old implementation let the browser's <input type="number"> accept an
// unlimited number of digits, then only trimmed things down to 10 decimal
// digits on blur. Past ~15-16 digits a native number input silently renders
// the value in scientific notation (e.g. "1.2345678901e+20") while you're
// still typing. Trimming *that* string to 10 characters chopped off the
// exponent, so a huge number silently collapsed into a tiny decimal.
//
// The fix removes the browser's own number formatting from the equation:
// these are plain, fully-controlled text inputs, and every keystroke is
// sanitized so the value can never grow past MAX_DIGITS digits in the first
// place — there's nothing left for the browser to reformat.

export const MAX_DIGITS = 10;

/**
 * Keep only a leading '-', digits, and a single '.', and cap the number of
 * digit characters at MAX_DIGITS. Extra digits are simply dropped, so typing
 * past the limit has no effect instead of corrupting the value later.
 */
export function sanitizeNumericInput(raw) {
  let value = raw.replace(/[^0-9.-]/g, '');

  const negative = value.startsWith('-');
  value = value.replace(/-/g, '');

  const dotIndex = value.indexOf('.');
  if (dotIndex !== -1) {
    value = value.slice(0, dotIndex + 1) + value.slice(dotIndex + 1).replace(/\./g, '');
  }

  let digitCount = 0;
  let out = '';
  for (const ch of value) {
    if (ch >= '0' && ch <= '9') {
      if (digitCount >= MAX_DIGITS) continue;
      digitCount += 1;
    }
    out += ch;
  }

  return (negative ? '-' : '') + out;
}

/**
 * Commit-time cleanup, run on blur.
 *
 * This used to run the value through `Math.fround` to "round to a 32-bit
 * float" — that's what turned 2342342342 into 2342342400: float32 only has
 * ~7 significant decimal digits of precision, so any larger integer gets
 * silently rounded to the nearest value it *can* represent. With the digit
 * cap already limiting values to 10 digits (safely inside what a normal
 * double can represent exactly), that rounding wasn't protecting anything —
 * it was just corrupting otherwise-valid input. So this step no longer
 * touches precision at all: it only fills in the fallback for an empty/
 * invalid value and trims cosmetic loose ends (a bare "-", a trailing ".",
 * leading zeros), preserving every digit the person actually typed.
 */
export function commitNumericValue(raw, fallback) {
  const sanitized = sanitizeNumericInput(String(raw));

  if (sanitized === '' || sanitized === '-' || sanitized === '.' || sanitized === '-.') {
    return String(fallback);
  }
  if (!Number.isFinite(parseFloat(sanitized))) {
    return String(fallback);
  }

  const negative = sanitized.startsWith('-');
  const unsigned = negative ? sanitized.slice(1) : sanitized;
  const [rawInt, rawFrac] = unsigned.split('.');

  let intPart = rawInt.replace(/^0+(?=\d)/, '');
  if (intPart === '') intPart = '0';

  const fracPart = rawFrac !== undefined ? rawFrac.replace(/0+$/, '') : '';

  let value = fracPart ? `${intPart}.${fracPart}` : intPart;
  const isZero = /^0*$/.test(intPart) && fracPart === '';
  if (negative && !isZero) value = `-${value}`;

  return value;
}
