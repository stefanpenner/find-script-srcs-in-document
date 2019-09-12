const { expect } = require('chai');
const fs = require('fs');

describe('find-script-srcs-in-document', function() {
  const script = require('./index');

  it('basic usage', function() {
    expect(script("")).to.eql([]);
    expect(script("<script>")).to.eql([]);
    expect(script("<script src></script>")).to.eql(['']);
    expect(script("<script>alert('hi');</script>")).to.eql([]);
    expect(script("<script src=''></script>")).to.eql(['']);
    expect(script("<script src='foo'></script>")).to.eql(['foo']);
    expect(script("<script src='foo'></script><script src='bar'></script>")).to.eql(['foo', 'bar']);
    expect(script("<html><head><script src='foo'></script><script src='bar'></script></head><body></body></html>")).to.eql(['foo', 'bar']);
    expect(script("<div></div>")).to.eql([]);
    expect(script("<div>")).to.eql([]);
    expect(script("<div")).to.eql([]);
  });

  it('filtering', function() {
    expect(script("<script src=''></script>", _ => true)).to.eql(['']);
    expect(script("<script src=''></script>", _ => false)).to.eql([]);

    expect(script("<script src='' data-embroider-ignore></script>", token => {
      return !token.attributes.find(attribute => attribute[0] === 'data-embroider-ignore')
    })).to.eql([]);

    expect(script("<script src='' data-embroider-ignore></script><script src='rob'></script>", token => {
      return !token.attributes.find(attribute => attribute[0] === 'data-embroider-ignore')
    })).to.eql(['rob']);
  });

  it('attributeToIgnore', function() {
    expect(script("<script src='' data-embroider-ignore></script>", script.ignoreWithAttribute('data-embroider-ignore'))).to.eql([]);
    expect(script("<script src='' data-embroider-ignore></script><script src=rob></script>", script.ignoreWithAttribute('data-embroider-ignore'))).to.eql(["rob"]);
  });

  it('handles https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script', function() {
    const file = fs.readFileSync(__dirname + '/fixtures/script', 'UTF8')

    expect(script(file)).to.eql([
      'https://cdn.speedcurve.com/js/lux.js?id=108906238',
      '/static/build/js/perf.654b849a6fd9.js',
      '/static/build/js/react-main.ea06fc41fe1f.js'
    ]);
  });

  it('handles tc39', function() {
    const file = fs.readFileSync(__dirname + '/fixtures/tc39', 'UTF8')

    expect(script(file)).to.eql([
      'ecmarkup.js'
    ]);
  });
});
