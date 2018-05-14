const {filter} = require('./filter');

describe('[Unit] `filter`', () => {
  describe('with `filter`', () => {
    it('should be a function', () => {
      expect(filter).toBeInstanceOf(Function);
    });

    it('should return an empty object with no params', () => {
      const filteredObj = filter();

      expect(filteredObj).toEqual({});
    });

    it('should return a shallow copy of an object with no predicate', () => {
      const origObj = {foo: false, bar: undefined};
      const filteredObj = filter(origObj);

      expect(filteredObj).toEqual(origObj);
      expect(filteredObj).not.toBe(origObj);
    });

    it('should return a filtered shallow copy of an object', () => {
      const origObj = {foo: false, bar: undefined};
      const filteredObj = filter(origObj, ([k, v]) => v !== undefined);

      expect(filteredObj).toEqual({foo: false});
    });
  });
});
