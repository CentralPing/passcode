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

    it('should return an error without a secret', () => {
      const {error: err2} = issue();
      expect(err2).not.toBeNull();
      expect(err2.message).toEqual(expect.stringMatching(/secret/i));
    });

    it('should issue a token with a secret', () => {
      const {error, value} = issue({}, {secret: v4()});
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
      const {value: {token}} = issue({}, {secret});

      const {error: err1} = verify();
      expect(err1).not.toBeNull();
      expect(err1.message).toBe('jwt must be provided');

      const {error: err2} = verify('foobar');
      expect(err2).not.toBeNull();
      expect(err2.message).toBe('jwt malformed');

      const {error: err3} = verify(token);
      expect(err3).not.toBeNull();
      expect(err3.message).toEqual(expect.stringMatching(/secret/i));

      const {error: err5} = verify(token, {secret, code: '012345'});
      expect(err5).not.toBeNull();
      expect(err5.message).toBe('Invalid challenge code');
    });

    /* eslint-disable-next-line max-len */
    it('should return the decoded token with valid token, secret and code', () => {
      const secret = v4();
      const {value: {token, code}} = issue({}, {secret});
      const {error, value} = verify(token, {secret, code});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with expired token', () => {
      const secret = v4();
      const {value: {token, code}} = issue({}, {secret, expiresIn: '-1s'});
      const {error} = verify(token, {secret, code});

      expect(error).not.toBeNull();
      expect(error.message).toBe('jwt expired');
    });

    describe('with custom salt', () => {
      it('should return an error with invalid value', () => {
        const secret = v4();
        const salt = v4();

        const {value: {token: tok1, code: cod1}} = issue({}, {secret}, {salt});
        const {error: err1} = verify(tok1, {secret, code: cod1});
        expect(err1).not.toBeNull();
        expect(err1.message).toBe('Invalid challenge code');

        const {value: {token: tok2, code: cod2}} = issue({}, {secret}, {salt});
        const {error: err2} = verify(tok2, {secret, code: cod2}, {salt: 'foo'});
        expect(err2).not.toBeNull();
        expect(err2.message).toBe('Invalid challenge code');

        const {value: {token: tok3, code: cod3}} = issue({}, {secret});
        const {error: err3} = verify(tok3, {secret, code: cod3}, {salt});
        expect(err3).not.toBeNull();
        expect(err3.message).toBe('Invalid challenge code');
      });

      it('should return the decoded token with valid value', () => {
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
    });

    describe('with custom subject', () => {
      it('should return an error with invalid value', () => {
        const secret = v4();
        const {value: {token, code}} = issue({sub: 'foo'}, {secret});
        const {error} = verify(token, {secret, code, sub: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt subject invalid. expected: bar');
      });

      it('should return the decoded token with valid value', () => {
        const secret = v4();
        const {value: {token, code}} = issue({sub: 'foo'}, {secret});
        const {error, value} = verify(token, {secret, code, sub: 'foo'});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp),
          sub: 'foo'
        });
      });
    });

    describe('with custom issuer', () => {
      it('should return an error with invalid value', () => {
        const secret = v4();
        const {value: {token, code}} = issue({iss: 'foo'}, {secret});
        const {error} = verify(token, {secret, code, iss: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt issuer invalid. expected: bar');
      });

      it('should return the decoded token with valid value', () => {
        const secret = v4();
        const {value: {token, code}} = issue({iss: 'foo'}, {secret});
        const {error, value} = verify(token, {secret, code, iss: 'foo'});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp),
          iss: 'foo'
        });
      });
    });

    describe('with custom audience', () => {
      it('should return an error with invalid value', () => {
        const secret = v4();
        const {value: {token, code}} = issue({aud: 'foo'}, {secret});
        const {error} = verify(token, {secret, code, aud: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt audience invalid. expected: bar');
      });

      it('should return the decoded token with valid value', () => {
        const secret = v4();
        const {value: {token, code}} = issue({aud: 'foo'}, {secret});
        const {error, value} = verify(token, {secret, code, aud: 'foo'});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp)
        });
      });
    });

    describe('with custom code', () => {
      it('should return an error with invalid value', () => {
        const secret = v4();
        const {value: {token}} = issue({}, {secret, code: 'foo'});
        const {error} = verify(token, {secret, code: 'bar'});
        expect(error).not.toBeNull();
        expect(error.message).toBe('Invalid challenge code');
      });

      it('should return the decoded token with valid value', () => {
        const secret = v4();
        const {value: {token}} = issue({}, {secret, code: 'foo'});
        const {error, value} = verify(token, {secret, code: 'foo'});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp)
        });
      });
    });

    describe('with custom issue time', () => {
      it('should allow custom issue time', () => {
        const secret = v4();
        const {value: {token}} = issue(
          {iat: Math.floor(Date.now() / 1000) - 601},
          {secret}
        );
        const {error} = verify(token, {secret, code: 'bar'});
        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt expired');
      });
    });

    it('should include custom token ID in the decoded token', () => {
      const secret = v4();
      const {value: {token, code}} = issue({jti: 'bar'}, {secret});
      const {error, value} = verify(token, {secret, code});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: 'bar'
      });
    });

    it('should include custom claims in the decoded token', () => {
      const secret = v4();
      const {value: {token, code}} = issue({foo: 'bar'}, {secret});
      const {error, value} = verify(token, {secret, code});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp),
        foo: 'bar'
      });
    });
  });
});
