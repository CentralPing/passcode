const {randomCode} = require('./random-code');

describe('[Unit] `randomCode`', () => {
  it('should export a function', () => {
    expect(randomCode).toBeInstanceOf(Function);
  });

  it('should return a stringified numeric code with no params', () => {
    const code = randomCode();
    expect(code).toMatch(/^[0-9]{6}$/);
  });

  it('should return a 3 character stringified numeric code', () => {
    const code = randomCode(3);
    expect(code).toMatch(/^[0-9]{3}$/);
  });

  it('should return a 14 character stringified numeric code', () => {
    const code = randomCode(14);
    expect(code).toMatch(/^[0-9]{14}$/);
  });
});
