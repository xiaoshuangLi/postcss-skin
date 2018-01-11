import temp from './temp';

const { prefix, ...others } = temp;

export default function(obj = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  if (!window._skinEle) {
    window._skinEle = document.createElement('style');
    window._skinEle.setAttribute('type', 'text/css')
    document.head.appendChild(window._skinEle);
  }

  let res = Object.values(others).join('');

  Object.keys(obj).forEach((key) => {
    const value = obj[key] || '';
    const reg = new RegExp(`${prefix}${key}`, 'g');

    res = res.replace(reg, value);
  });

  res = res.replace(new RegExp(prefix, 'g'), '');

  window._skinEle.innerHTML = res;
};