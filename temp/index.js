import temp from './temp';

const { prefix, ...others } = temp;

let style;

export default function(obj = {}) {
  if (window === undefined || document === undefined) {
    return null;
  }

  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css')
    document.head.appendChild(style);
  }

  let res = Object.values(others).join('');

  Object.keys(obj).forEach((key) => {
    const value = obj[key] || '';
    const reg = new RegExp(`${prefix}${key}`, 'g');

    res = res.replace(reg, value);
  });

  res = res.replace(prefix, '');

  style.innerHTML = res;
};