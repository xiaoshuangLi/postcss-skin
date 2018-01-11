
export function generateModuleCode(source, attr = '') {
  attr = attr ? `.${attr}` : '';

  const res = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `module.exports${attr} = ${res};`;
};

export function clearObject(obj = {}) {
  const res =  Object.keys(obj).reduce((a, b) => {
    const value = obj[b];

    if (!value) {
      return a;
    }

    a[b] = value;
    return a;
  }, {});

  return res;
};

const keyframesReg = /\@+((\s|\S)*)keyframes(\s|\S)*}(?=(\s|\n|}))/g;

const containerRegs = [
  /\@(media|supports)(\s|\S)*}(?=(\s|\n|}))/g,
];

export function clearSource(source, temps = []) {
  temps = Array.isArray(temps) ? temps : [temps];

  const res = temps.reduce(
    (source, temp) => source.replace(temp, ''),
    source
  );

  return res;
};

export function getTempsAndCss(source, options = {}) {
  const { prefix = '' } = options;

  source += ' ';

  const prefixReg = new RegExp(`${prefix}\\s(\\s|\\S)*?}`, 'g');
  const prefixWordReg = new RegExp(prefix, 'g');

  const containerTemps = containerRegs
    .reduce((temps, reg) => temps.concat(source.match(reg)), [])
    .filter(temp => prefixReg.test(temp));

  source = clearSource(source, containerTemps);

  let keyframesTemps = source.match(keyframesReg) || [];
  keyframesTemps = keyframesTemps.filter(
    temp => prefixWordReg.test(temp)
  );

  source = clearSource(source, keyframesTemps);

  const prefixTemps = source.match(prefixReg);

  source = clearSource(source, prefixReg);

  return {
    temps: [].concat(containerTemps, keyframesTemps, prefixTemps),
    css: source,
  };
};