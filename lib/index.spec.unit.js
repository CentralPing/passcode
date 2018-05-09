const {issue, verify} = require('./index');

describe('[Unit] `index`', () => {
  it('should export a `issue` function', () => {
    expect(issue).toBeInstanceOf(Function);
  });

  it('should export a `verify` function', () => {
    expect(verify).toBeInstanceOf(Function);
  });
});
