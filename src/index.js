import loaderUtils from 'loader-utils';
import path from 'path';
import fs from 'fs';

import mixin from './mixin';
import { generateModuleCode } from './utils';

const tempPath = path.resolve(__dirname, './temp/temp.js');
const temp = require(tempPath);

const defaultOptions = {
  type: 'before-sass',
  prefix: '_skin_',
};

function saveTemp(temps = [], resourcePath = '', options = {}) {
  const { prefix = '' } = options;

  if (temps.length) {
    temp[resourcePath] = temps.join('');
  }

  let res = generateModuleCode(temp);
  res += generateModuleCode(prefix, 'prefix');

  fs.writeSync(fs.openSync(tempPath, 'w'), res);
}

const funcs = {
  ['before-sass'](source = '', options = {}) {
    const { prefix = '' } = options;
    const mixinCode = mixin(prefix);

    const res = `${mixinCode}${source}`;

    return res;
  },
  ['after-sass'](source, options = {}) {
    const { resourcePath } = this;
    const { prefix = '' } = options;

    const reg = new RegExp(`${prefix}\\s(\\s|\\S)*?}`, 'g');

    const temps = source.match(reg) || [];
    saveTemp(temps, resourcePath, options);

    const res = source.replace(reg, '');

    return res;
  },
};

function loader(source) {
  const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(this));
  const { type = '', prefix = '' } = options;

  if (!type) {
    return console.error(`Type is required for skin-loader, please chose in ${Object.keys(funcs).join(',')}`);
  }

  if (!prefix) {
    console.warn('Prefix is necessary to avoid the conflict of name');
  }

  const func = funcs[type];
  const res = func.call(this, source, options);

  return res;
}

export default loader;
