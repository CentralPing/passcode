const {v4} = require('uuid');

const {issue, verify} = require('./main');

/* eslint-disable-next-line max-len */
const v4RegExp = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const tokenRegExp = /^[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+$/;
const codeRegExp = /^[0-9]{6}$/;

describe('[Unit] token', () => {
  describe('`issue`', () => {
    it('should be a function', () => {
      expect(issue).toBeInstanceOf(Function);
    });

    it('should return an error without salt and a secret', () => {
      const {error: err1} = issue({}, {secret: v4()});
      expect(err1).not.toBeNull();
      expect(err1.message).toEqual(expect.stringMatching(/salt/i));

      const {error: err2} = issue({}, {}, {salt: v4()});
      expect(err2).not.toBeNull();
      expect(err2.message).toEqual(expect.stringMatching(/secret/i));
    });

    it('should issue a token with salt and a secret', () => {
      const {error, value} = issue({}, {secret: v4()}, {salt: v4()});
      expect(error).toBeNull();
      expect(value).toMatchObject({
        id: expect.stringMatching(v4RegExp),
        expires: expect.any(Number),
        code: expect.stringMatching(codeRegExp),
        token: expect.stringMatching(tokenRegExp)
      });
    });
  });

  describe('`verify`', () => {
    it('should be a function', () => {
      expect(verify).toBeInstanceOf(Function);
    });

    it('should return an error without a valid token, secret and code', () => {
      const secret = v4();
      const salt = v4();
      const {value: {token}} = issue({}, {secret}, {salt});

      const {error: err1} = verify();
      expect(err1).not.toBeNull();
      expect(err1.message).toBe('jwt must be provided');

      const {error: err2} = verify('foobar');
      expect(err2).not.toBeNull();
      expect(err2.message).toBe('jwt malformed');

      const {error: err3} = verify(token);
      expect(err3).not.toBeNull();
      expect(err3.message).toEqual(expect.stringMatching(/secret/i));

      const {error: err4} = verify(token, {secret});
      expect(err4).not.toBeNull();
      expect(err4.message).toEqual(expect.stringMatching(/salt/i));

      const {error: err5} = verify(token, {secret, code: '012345'}, {salt});
      expect(err5).not.toBeNull();
      expect(err5.message).toBe('Invalid challenge code');
    });

    /* eslint-disable-next-line max-len */
    it('should return the decoded token with valid token, secret and code', () => {
      const secret = v4();
      const salt = v4();
      const {value: {token, code}} = issue({}, {secret}, {salt});
      const {error, value} = verify(token, {secret, code}, {salt});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with invalid subject', () => {
      const secret = v4();
      const salt = v4();
      /* eslint-disable-next-line max-len */
      const {value: {token, code}} = issue({}, {secret, subject: 'foo'}, {salt});
      const {error} = verify(token, {secret, code, subject: 'bar'}, {salt});

      expect(error).not.toBeNull();
      expect(error.message).toBe('jwt subject invalid. expected: bar');
    });

    it('should return the decoded token with valid subject', () => {
      const secret = v4();
      const salt = v4();
      /* eslint-disable-next-line max-len */
      const {value: {token, code}} = issue({}, {secret, subject: 'foo'}, {salt});
      /* eslint-disable-next-line max-len */
      const {error, value} = verify(token, {secret, code, subject: 'foo'}, {salt});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with invalid issuer', () => {
      const secret = v4();
      const salt = v4();
      const {value: {token, code}} = issue({}, {secret, issuer: 'foo'}, {salt});
      const {error} = verify(token, {secret, code, issuer: 'bar'}, {salt});

      expect(error).not.toBeNull();
      expect(error.message).toBe('jwt issuer invalid. expected: bar');
    });

    it('should return the decoded token with valid code and issuer', () => {
      const secret = v4();
      const salt = v4();
      const {value: {token, code}} = issue({}, {secret, issuer: 'foo'}, {salt});
      /* eslint-disable-next-line max-len */
      const {error, value} = verify(token, {secret, code, issuer: 'foo'}, {salt});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with invalid audience', () => {
      const secret = v4();
      const salt = v4();
      /* eslint-disable-next-line max-len */
      const {value: {token, code}} = issue({}, {secret, audience: 'foo'}, {salt});
      const {error} = verify(token, {secret, code, audience: 'bar'}, {salt});

      expect(error).not.toBeNull();
      expect(error.message).toBe('jwt audience invalid. expected: bar');
    });

    it('should return the decoded token with valid code and audience', () => {
      const secret = v4();
      const salt = v4();
      /* eslint-disable-next-line max-len */
      const {value: {token, code}} = issue({}, {secret, audience: 'foo'}, {salt});
      /* eslint-disable-next-line max-len */
      const {error, value} = verify(token, {secret, code, audience: 'foo'}, {salt});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with expired token', () => {
      const secret = v4();
      const salt = v4();
      /* eslint-disable-next-line max-len */
      const {value: {token, code}} = issue({}, {secret, expiresIn: '-1s'}, {salt});
      const {error} = verify(token, {secret, code}, {salt});

      expect(error).not.toBeNull();
      expect(error.message).toBe('jwt expired');
    });

    it('should include custom token ID in the decoded token', () => {
      const secret = v4();
      const salt = v4();
      const {value: {token, code}} = issue({jti: 'bar'}, {secret}, {salt});
      const {error, value} = verify(token, {secret, code}, {salt});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: 'bar'
      });
    });

    it('should include custom claims in the decoded token', () => {
      const secret = v4();
      const salt = v4();
      const {value: {token, code}} = issue({foo: 'bar'}, {secret}, {salt});
      const {error, value} = verify(token, {secret, code}, {salt});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp),
        foo: 'bar'
      });
    });

    describe('with custom code', () => {
      it('should return an error with invalid custom code', () => {
        const secret = v4();
        const salt = v4();
        const {value: {token}} = issue({}, {secret, code: 'foo'}, {salt});
        const {error} = verify(token, {secret, code: 'bar'}, {salt});
        expect(error).not.toBeNull();
        expect(error.message).toBe('Invalid challenge code');
      });

      /* eslint-disable-next-line max-len */
      it('should return the decoded token with valid custom code', () => {
        const secret = v4();
        const salt = v4();
        const {value: {token}} = issue({}, {secret, code: 'foo'}, {salt});
        const {error, value} = verify(token, {secret, code: 'foo'}, {salt});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp)
        });
      });
    });

    describe('with custom issue time', () => {
      it('should allow custom issue times', () => {
        const secret = v4();
        const salt = v4();
        const {value: {token}} = issue(
          {iat: Math.floor(Date.now() / 1000) - 601},
          {secret},
          {salt}
        );
        const {error} = verify(token, {secret, code: 'bar'}, {salt});
        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt expired');
      });
    });
  });
});
