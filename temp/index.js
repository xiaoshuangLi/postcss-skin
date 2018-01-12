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

  let res = Object.values(others).join('\u0020');

  const cssCharReg = /\s|:|;|,/g;

  // for support ( '_skin_attr' || _skin_attr ) => _skin_attr
  const quotationReg = /"|'/g;
  // for split attr string '_skin_obj._skin_attr' => ['_skin_obj', '_skin_attr'];
  const splitReg = /\[|\]|\./g; 

  // for create attr reg '[0]' => /\[0\]/
  const splitMatchReg = /(\[|\]|\.)/g;

  // for get `${prefix}${....}` (like: '_skin_color')
  const keywordReg = new RegExp(`('|"|\\s|:|,)${prefix}\\S(\\s|\\S)*?('|"|\\s|;|,)`, 'g');

  // for clear prefix in code
  const prefixReg = new RegExp(prefix, 'g');

  const store = res
    .match(keywordReg)
    .reduce((a, keyword) => {
      const origin = keyword.replace(cssCharReg, '');
      const prefixAttrsStr = origin.replace(quotationReg, '');

      a[prefixAttrsStr] = a[prefixAttrsStr] ? Array.prototype.concat.call(a[prefixAttrsStr], origin) : [origin];

      return a;
    }, {});

  Object.keys(store).forEach((prefixAttrsStr) => {
    const origins = store[prefixAttrsStr];

    const prefixAttrs = prefixAttrsStr
      .split(splitReg)
      .filter(attr => !!attr);

    const attrs = prefixAttrs
      .map(prefixAttr => prefixAttr.replace(prefixReg, ''))
      .filter(attr => !!attr);

    const value = attrs.reduce((a, attr, index) => {
      const prefixAttr = prefixAttrs[index];
      const attrValue = a[attr];

      if (attrValue === undefined) {
        console.warn(`Have issue with ${prefixAttr} in ${prefixAttrs}.`);

        return 'NO_DATA_IN_STORE';
      }

      return attrValue;
    }, obj);

    const originsStr =  origins
      .join('|')
      .replace(splitMatchReg, '\\$1');

    const originsReg = new RegExp(originsStr, 'g');

    res = res.replace(originsReg, value);
  });

  res = res.replace(prefixReg, '');

  window._skinEle.innerHTML = res;
};