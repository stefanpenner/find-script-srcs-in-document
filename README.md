# find-script-srcs-in-document

A quick and simple took to find all script src's in a given HTML document.
Under the hood we [simple-html-tokenizer](https://github.com/tildeio/simple-html-tokenizer) to parse the document.

## Usage

```sh
yarn add find-script-srcs-in-document
```

```javascript
const allScriptSources = require('find-script-srcs-in-document');

// basic
allScriptSources('<html><script src="foo"></scripts>') === ['foo'];

// with the ability to ignore on a specific attribute
allScriptSources('<html><script src="foo" data-ignore-me></scripts>', allScriptSources.ignoreWithAttribute('data-ignore-me')) === [];

// advanced
allScriptSources('<html><script src="foo" data-ignore-me></scripts>', scriptToken => {
  const {
    type,       // string type (StartTag)
    tagName,    // string tagName (script)
    attributes, // array of attributes
    selfClosing // boolean
  } = scriptToken;

  return attributes.find(attribute => attribute[0] === 'data-ignore-me')
})) === [];
```
