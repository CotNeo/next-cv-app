/**
 * PostCSS plugin: replace oklch() with rgb() so html2canvas (no oklch support) can parse CSS.
 */
const { parse, formatRgb } = require('culori');

function replaceOklchInValue(value) {
  if (!value || typeof value !== 'string' || !value.includes('oklch')) return value;
  let result = '';
  let i = 0;
  while (i < value.length) {
    const start = value.indexOf('oklch(', i);
    if (start === -1) {
      result += value.slice(i);
      break;
    }
    result += value.slice(i, start);
    let depth = 1;
    let j = start + 6;
    while (j < value.length && depth > 0) {
      if (value[j] === '(') depth++;
      else if (value[j] === ')') depth--;
      j++;
    }
    const oklchStr = value.slice(start, j);
    try {
      const color = parse(oklchStr);
      if (color) result += formatRgb(color);
      else result += oklchStr;
    } catch {
      result += oklchStr;
    }
    i = j;
  }
  return result;
}

function oklchToRgb() {
  return {
    postcssPlugin: 'postcss-oklch-to-rgb',
    Declaration(decl) {
      if (decl.value && decl.value.includes('oklch')) {
        decl.value = replaceOklchInValue(decl.value);
      }
    },
  };
}
oklchToRgb.postcss = true;

module.exports = oklchToRgb;
