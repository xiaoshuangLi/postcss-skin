import temp from './temp';

const { prefix, ...others } = temp;

export function createTemp(temp = others) {
  const type = typeof temp;

  switch (type) {
    case 'string': {
      temp = [temp];
      break;
    }

    case 'object': {
      temp = Array.isArray(temp) ? temp : Object.values(temp);
      break;
    }
  }

  temp = temp.join('\u0020');

  return temp;
}

export default function(obj = {}, temp = others) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  if (!window._skinEle) {
    window._skinEle = document.createElement('style');
    window._skinEle.setAttribute('type', 'text/css')
    document.head.appendChild(window._skinEle);
  }

  let res = createTemp(temp);

  const cssCharReg = /\s|:|;|,/g;

  // for support ( '$attr' || $attr ) => $attr
  const quotationReg = /"|'/g;
  // for split attr string '$obj.$attr' => ['$obj', '$attr'];
  const splitReg = /\[|\]|\./g; 

  // for create attr reg '[0]' => /\[0\]/
  const splitMatchReg = /(?=(\W))/g;

  // for get `${prefix}${....}` (like: '$color')
  const keywordReg = new RegExp(`("(\s|\S)*${prefix}.*?"|'(\s|\S)*${prefix}.*?')`, 'g');

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
      .map(
        item => item.replace(splitMatchReg, '\\')
      )
      .join('|');

    const originsReg = new RegExp(originsStr, 'g');

    res = res.replace(originsReg, value);
  });

  res = res.replace(prefixReg, '');

  window._skinEle.innerHTML = res;
};