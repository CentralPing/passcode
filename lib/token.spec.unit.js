const {issue, verify} = require('./token');

/* eslint-disable-next-line max-len */
const v4RegExp = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const tokenRegExp = /^[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+$/;
const codeRegExp = /^[0-9]{6}$/;

describe('[Unit] token', () => {
  describe('`issue`', () => {
    it('should be a function', () => {
      expect(issue).toBeInstanceOf(Function);
    });

    it('should issue a token without params', () => {
      const {error, value} = issue();
      expect(error).toBeNull();
      expect(value).toBeInstanceOf(Object);
      expect(value).toMatchObject({
        id: expect.stringMatching(v4RegExp),
        expires: expect.any(Number),
        code: expect.stringMatching(codeRegExp),
        /* eslint-disable-next-line max-len */
        token: expect.stringMatching(tokenRegExp)
      });
    });
  });

  describe('`verify`', () => {
    it('should be a function', () => {
      expect(verify).toBeInstanceOf(Function);
    });

    it('should return an error without both a valid token and code', () => {
      const {value: {token}} = issue();

      const {error: err1} = verify();
      expect(err1).toBeInstanceOf(Error);
      expect(err1.message).toBe('jwt must be provided');

      const {error: err2} = verify('foobar');
      expect(err2).toBeInstanceOf(Error);
      expect(err2.message).toBe('jwt malformed');

      const {error: err3} = verify(token);
      expect(err3).toBeInstanceOf(Error);
      expect(err3.message).toBe('Invalid challenge code');

      const {error: err4} = verify(token, {code: '012345'});
      expect(err4).toBeInstanceOf(Error);
      expect(err4.message).toBe('Invalid challenge code');
    });

    it('should return the decoded token with valid token and code', () => {
      const {value: {token, code}} = issue();
      const {value} = verify(token, {code});

      expect(value).toBeInstanceOf(Object);
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with invalid subject', () => {
      const {value: {token, code}} = issue({}, {subject: 'foo'});
      const {error} = verify(token, {code, subject: 'bar'});

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('jwt subject invalid. expected: bar');
    });

    it('should return the decoded token with valid subject', () => {
      const {value: {token, code}} = issue({}, {subject: 'foo'});
      const {value} = verify(token, {code, subject: 'foo'});

      expect(value).toBeInstanceOf(Object);
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with invalid issuer', () => {
      const {value: {token, code}} = issue({}, {issuer: 'foo'});
      const {error} = verify(token, {code, issuer: 'bar'});

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('jwt issuer invalid. expected: bar');
    });

    it('should return the decoded token with valid code and issuer', () => {
      const {value: {token, code}} = issue({}, {issuer: 'foo'});
      const {value} = verify(token, {code, issuer: 'foo'});

      expect(value).toBeInstanceOf(Object);
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with invalid audience', () => {
      const {value: {token, code}} = issue({}, {audience: 'foo'});
      const {error} = verify(token, {code, audience: 'bar'});

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('jwt audience invalid. expected: bar');
    });

    it('should return the decoded token with valid code and audience', () => {
      const {value: {token, code}} = issue({}, {audience: 'foo'});
      const {value} = verify(token, {code, audience: 'foo'});

      expect(value).toBeInstanceOf(Object);
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with expired token', () => {
      const {value: {token, code}} = issue({}, {expiresIn: '-1s'});
      const {error} = verify(token, {code, audience: 'bar'});

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('jwt expired');
    });

    it('should include custom claims in the decoded token', () => {
      const {value: {token, code}} = issue({foo: 'bar'});
      const {value} = verify(token, {code});

      expect(value).toBeInstanceOf(Object);
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp),
        foo: 'bar'
      });
    });
  });
});
