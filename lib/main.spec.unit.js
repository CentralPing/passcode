const {v4} = require('uuid');

const {issue, verify} = require('./main');

/* eslint-disable-next-line max-len */
const v4RegExp = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const tokenRegExp = /^[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+$/;
const passcodeRegExp = /^[0-9]{6}$/;

describe('[Unit] token', () => {
  describe('`issue`', () => {
    it('should be a function', () => {
      expect(issue).toBeInstanceOf(Function);
    });

    it('should return an error without salt and a secret', () => {
      const {error: err1} = issue({salt: v4()});
      expect(err1).not.toBeNull();
      expect(err1.message).toBe('"secret" is required');

      const {error: err2} = issue({secret: v4()});
      expect(err2).not.toBeNull();
      expect(err2.message).toBe('"salt" is required');
    });

    /* eslint-disable-next-line max-len */
    it('should issue a hashed passcode in a signed token with salt and a secret', () => {
      const {error, value} = issue({salt: v4(), secret: v4()});
      expect(error).toBeNull();
      expect(value).toMatchObject({
        id: expect.stringMatching(v4RegExp),
        expires: expect.any(Number),
        passcode: expect.stringMatching(passcodeRegExp),
        token: expect.stringMatching(tokenRegExp)
      });
    });
  });

  describe('`verify`', () => {
    it('should be a function', () => {
      expect(verify).toBeInstanceOf(Function);
    });

    /* eslint-disable-next-line max-len */
    it('should return an error without a valid token, a secret, salt and passcode', () => {
      const salt = v4();
      const secret = v4();
      const {value: {token, passcode}} = issue({salt, secret});

      const {error: err1} = verify(undefined, {passcode, salt, secret});
      expect(err1).not.toBeNull();
      expect(err1.message).toBe('"token" is required');

      const {error: err2} = verify('foobar', {passcode, salt, secret});
      expect(err2).not.toBeNull();
      expect(err2.message).toBe('jwt malformed');

      const {error: err3} = verify(token, {passcode, secret});
      expect(err3).not.toBeNull();
      expect(err3.message).toBe('"salt" is required');

      const {error: err4} = verify(token, {passcode, salt});
      expect(err4).not.toBeNull();
      expect(err4.message).toBe('"secret" is required');

      const {error: err5} = verify(token, {salt, secret});
      expect(err5).not.toBeNull();
      expect(err5.message).toBe('"passcode" is required');

      const {error: err6} = verify(token, {passcode: 'foo', salt, secret});
      expect(err6).not.toBeNull();
      expect(err6.message).toBe('Invalid challenge passcode');
    });

    /* eslint-disable-next-line max-len */
    it('should return the decoded token with valid token, secret and passcode', () => {
      const salt = v4();
      const secret = v4();
      const {value: {token, passcode}} = issue({salt, secret});
      const {error, value} = verify(token, {passcode, salt, secret});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should return an error with expired token', () => {
      const salt = v4();
      const secret = v4();
      const {value: {token, passcode}} = issue({salt, secret}, undefined, {expiresIn: '-1s'});
      const {error} = verify(token, {passcode, salt, secret});


      expect(error).not.toBeNull();
      expect(error.message).toBe('jwt expired');
    });

    describe('with custom subject', () => {
      it('should return an error with invalid value in payload', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret}, {sub: 'foo'});
        const {error} = verify(token, {passcode, salt, secret, sub: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt subject invalid. expected: bar');
      });

      it('should return an error with invalid value in security', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret, sub: 'foo'});
        const {error} = verify(token, {passcode, salt, secret, sub: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt subject invalid. expected: bar');
      });

      it('should return the decoded token with valid value in payload', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret}, {sub: 'foo'});
        const {error, value} = verify(token, {passcode, salt, secret, sub: 'foo'});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp),
          sub: 'foo'
        });
      });

      it('should return the decoded token with valid value in security', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret, sub: 'foo'});
        const {error, value} = verify(token, {passcode, salt, secret, sub: 'foo'});

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
      it('should return an error with invalid value in payload', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret}, {iss: 'foo'});
        const {error} = verify(token, {passcode, salt, secret, iss: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt issuer invalid. expected: bar');
      });

      it('should return an error with invalid value in security', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret, iss: 'foo'});
        const {error} = verify(token, {passcode, salt, secret, iss: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt issuer invalid. expected: bar');
      });

      it('should return the decoded token with valid value in payload', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret}, {iss: 'foo'});
        const {error, value} = verify(token, {passcode, salt, secret, iss: 'foo'});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp),
          iss: 'foo'
        });
      });

      it('should return the decoded token with valid value in security', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret, iss: 'foo'});
        const {error, value} = verify(token, {passcode, salt, secret, iss: 'foo'});

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
      it('should return an error with invalid value in payload', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret}, {aud: 'foo'});
        const {error} = verify(token, {passcode, salt, secret, aud: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt audience invalid. expected: bar');
      });

      it('should return an error with invalid value in security', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret, aud: 'foo'});
        const {error} = verify(token, {passcode, salt, secret, aud: 'bar'});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt audience invalid. expected: bar');
      });

      it('should return the decoded token with valid value in payload', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret}, {aud: 'foo'});
        const {error, value} = verify(token, {passcode, salt, secret, aud: 'foo'});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp),
          aud: 'foo'
        });
      });

      it('should return the decoded token with valid value in security', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret, aud: 'foo'});
        const {error, value} = verify(token, {passcode, salt, secret, aud: 'foo'});

        expect(error).toBeNull();
        expect(value).toMatchObject({
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.stringMatching(v4RegExp),
          aud: 'foo'
        });
      });
    });

    describe('with custom passcode', () => {
      it('should return an error with invalid value', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token}} = issue({passcode: 'foo', salt, secret});
        const {error} = verify(token, {passcode: 'bar', salt, secret});

        expect(error).not.toBeNull();
        expect(error.message).toBe('Invalid challenge passcode');
      });

      it('should return the decoded token with valid value', () => {
        const salt = v4();
        const secret = v4();
        const {value: {token}} = issue({passcode: 'foo', salt, secret});
        const {error, value} = verify(token, {passcode: 'foo', salt, secret});

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
        const salt = v4();
        const secret = v4();
        const {value: {token, passcode}} = issue({salt, secret}, {iat: Math.floor(Date.now() / 1000) - 601});
        const {error} = verify(token, {passcode, salt, secret});

        expect(error).not.toBeNull();
        expect(error.message).toBe('jwt expired');
      });
    });

    it('should include custom token ID in the decoded token', () => {
      const salt = v4();
      const secret = v4();
      const {value: {token, passcode}} = issue({salt, secret}, {jti: 'foo'});
      const {error, value} = verify(token, {passcode, salt, secret});

      expect(error).toBeNull();
      expect(value).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: 'foo'
      });
    });

    it('should include custom claims in the decoded token', () => {
      const salt = v4();
      const secret = v4();
      const {value: {token, passcode}} = issue({salt, secret}, {foo: 'bar'});
      const {error, value} = verify(token, {passcode, salt, secret});

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
