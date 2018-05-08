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
      const tokenInfo = issue();

      expect(tokenInfo).toBeInstanceOf(Object);
      expect(tokenInfo).toMatchObject({
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

    it('should throw an error without params', () => {
      const verifyTest = () => {
        verify();
      };

      expect(verifyTest).toThrowError('jwt must be provided');
    });

    it('should throw an error without code', () => {
      const verifyTest = () => {
        const tokenInfo = issue();

        verify(tokenInfo.token);
      };

      expect(verifyTest).toThrowError('Invalid challenge code');
    });

    it('should throw an error with invalid challenge code', () => {
      const verifyTest = () => {
        const tokenInfo = issue();

        verify(tokenInfo.token, {code: '012345'});
      };

      expect(verifyTest).toThrowError('Invalid challenge code');
    });

    it('should return the decoded token with valid challenge code', () => {
      const tokenInfo = issue();
      const decodedToken = verify(tokenInfo.token, {code: tokenInfo.code});

      expect(decodedToken).toBeInstanceOf(Object);
      expect(decodedToken).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should throw an error with invalid subject', () => {
      const verifyTest = () => {
        const tokenInfo = issue({}, {subject: 'foo'});

        verify(tokenInfo.token, {code: tokenInfo.code, subject: 'bar'});
      };

      expect(verifyTest).toThrowError('jwt subject invalid. expected: bar');
    });

    it('should return the decoded token with valid code and subject', () => {
      const tokenInfo = issue({}, {subject: 'foo'});
      const decodedToken = verify(
        tokenInfo.token,
        {
          code: tokenInfo.code,
          subject: 'foo'
        }
      );

      expect(decodedToken).toBeInstanceOf(Object);
      expect(decodedToken).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should throw an error with invalid issuer', () => {
      const verifyTest = () => {
        const tokenInfo = issue({}, {issuer: 'foo'});

        verify(tokenInfo.token, {code: tokenInfo.code, issuer: 'bar'});
      };

      expect(verifyTest).toThrowError('jwt issuer invalid. expected: bar');
    });

    it('should return the decoded token with valid code and issuer', () => {
      const tokenInfo = issue({}, {issuer: 'foo'});
      const decodedToken = verify(
        tokenInfo.token,
        {
          code: tokenInfo.code,
          issuer: 'foo'
        }
      );

      expect(decodedToken).toBeInstanceOf(Object);
      expect(decodedToken).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should throw an error with invalid audience', () => {
      const verifyTest = () => {
        const tokenInfo = issue({audience: 'foo'});

        verify(tokenInfo.token, {code: tokenInfo.code, audience: 'bar'});
      };

      expect(verifyTest).toThrowError('jwt audience invalid. expected: bar');
    });

    it('should return the decoded token with valid code and audience', () => {
      const tokenInfo = issue({}, {audience: 'foo'});
      const decodedToken = verify(
        tokenInfo.token,
        {
          code: tokenInfo.code,
          audience: 'foo'
        }
      );

      expect(decodedToken).toBeInstanceOf(Object);
      expect(decodedToken).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp)
      });
    });

    it('should throw an error with expired token', () => {
      const verifyTest = () => {
        const tokenInfo = issue({}, {expiresIn: '-1s'});

        verify(tokenInfo.token, {code: tokenInfo.code});
      };

      expect(verifyTest).toThrowError('jwt expired');
    });

    it('should include custom claims in the decoded token', () => {
      const tokenInfo = issue({foo: 'bar'});
      const decodedToken = verify(tokenInfo.token, {code: tokenInfo.code});

      expect(decodedToken).toBeInstanceOf(Object);
      expect(decodedToken).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.stringMatching(v4RegExp),
        foo: 'bar'
      });
    });
  });
});
