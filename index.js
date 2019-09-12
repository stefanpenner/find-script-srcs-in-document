'use strict';

const { tokenize } = require('simple-html-tokenizer');

module.exports = script;

function script(x, cb) {
  const srcs = [];

  for (let token of tokenize(x)) {
    if (token.type === 'StartTag' && token.tagName === 'script') {
      for (let attribute of token.attributes) {
        if (attribute[0] === 'src') {
          if (typeof cb === 'function') {
            if (!cb(token)) {
              continue;
            }
          }

          srcs.push(attribute[1]);
        }
      }
    }
  }

  return srcs;
}

script.ignoreWithAttribute = function(attributeToIgnore) {
  return function(token) {
    return !token.attributes.find(attribute => attribute[0] === attributeToIgnore)
  }
};
