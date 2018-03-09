import path from 'path';
import fs from 'fs';
import postcss from 'postcss';

import { generateModuleCode, clearObject } from './utils';

const tempPath = path.resolve(__dirname, './temp/temp.js');
let temp = require(tempPath);

const saveTemp = (clonedRoot, prefix) => {
  const path = clonedRoot.source.input.file;
  const css = clonedRoot.toString();

  temp[path] = css;
  temp = clearObject(temp);

  let res = generateModuleCode(temp);
  res += generateModuleCode(prefix, 'prefix');

  fs.writeSync(fs.openSync(tempPath, 'w'), res);
}

const cleanRoot = (root) => {
  root.walkAtRules((atRule) => {
    let shouldRemove = false;

    atRule.walkDecls(decl => {
      shouldRemove = true
    });
    
    !shouldRemove && atRule.remove();
  });
  
  root.walkRules((rule) => {
    !rule.nodes.length && rule.remove();
  });

  return root;
};

const skinPlugin = (opts = {}) => {
  let { prefix = '$' } = opts;
  prefix = prefix.replace(/(?=(\W))/g, '\\');

  if (!prefix) {
    console.warn('Prefix is necessary for postcss-skin');

    return noop;
  }

  const reg = new RegExp(prefix);

  return (root) => {
    const clonedRoot = root.clone();

    root.walkDecls(
      decl => {
        reg.test(decl.value) && decl.remove();
      }
    );

    clonedRoot.walkDecls(
      decl => {
        !reg.test(decl.value) && decl.remove();
      }
    );

    cleanRoot(root);
    cleanRoot(clonedRoot);

    saveTemp(clonedRoot, prefix);
  };
};

const plugin = postcss.plugin('postcss-skin', skinPlugin);

module.exports = plugin;
