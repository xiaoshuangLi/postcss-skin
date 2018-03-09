
export function generateModuleCode(source, attr = '') {
  attr = attr ? `.${attr}` : '';

  const res = JSON.stringify(source);

  return `module.exports${attr} = ${res};`;
};

const reg =  /\w/;

export function clearObject(obj = {}) {
  const res =  Object.keys(obj).reduce((a, b) => {
    const value = obj[b] || '';

    if (!reg.test(value)) {
      return a;
    }

    a[b] = value;
    return a;
  }, {});

  return res;
};