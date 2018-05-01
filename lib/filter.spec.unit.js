const {filter} = require('./filter');

describe('[Unit] `filter`', () => {
  it('should export a function', () => {
    expect(filter).toBeInstanceOf(Function);
  });

  it('should return an empty object with no params', () => {
    const filteredObj = filter();

    expect(filteredObj).toMatchObject({});
  });

  it('should return a shallow copy of an object with no predicate', () => {
    const origObj = {foo: false, bar: undefined};
    const filteredObj = filter(origObj);

    expect(filteredObj).toMatchObject(origObj);
    expect(filteredObj).not.toBe(origObj);
  });

  it('should return a filtered shallow copy of an object', () => {
    const origObj = {foo: false, bar: undefined};
    const filteredObj = filter(origObj, ([key, value]) => value !== undefined);

    expect(filteredObj).toMatchObject({foo: false});
  });
});
