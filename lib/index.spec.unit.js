const {issue, verify} = require('./index');

describe('[Unit] `index`', () => {
  describe('with `issue`', () => {
    it('should be a function function', () => {
      expect(issue).toBeInstanceOf(Function);
    });
  });

  describe('with `verify`', () => {
    it('should be a function function', () => {
      expect(verify).toBeInstanceOf(Function);
    });
  });
});
