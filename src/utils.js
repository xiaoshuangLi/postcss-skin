export function generateModuleCode(source, attr = '') {
  attr = attr ? `.${attr}` : '';

  const res = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `module.exports${attr} = ${res};`;
};