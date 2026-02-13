import Crypto from './cryto';

describe('Encryption and Decryption', () => {
  const sampleData = { key: 'value' };
  const JWT_KEY = 'mysecretkey';

  it('should encrypt and decrypt an object correctly', () => {
    const encrypted = Crypto.encrypt(sampleData, JWT_KEY);
    const encrypted2 = Crypto.encrypt(sampleData);
    expect(encrypted).toBeTruthy();

    const decrypted = Crypto.decrypt(encrypted, JWT_KEY);
    Crypto.decrypt(encrypted2);
    expect(decrypted).toEqual(sampleData);
  });

  it('should return undefined when decrypting an empty input', () => {
    const decrypted = Crypto.decrypt('', JWT_KEY);
    expect(decrypted).toBeUndefined();
  });

  it('should return the string representation of the decrypted object', () => {
    Crypto.encrypt(sampleData);
    const encrypted = Crypto.encrypt(sampleData, JWT_KEY);
    Crypto.decrypt(encrypted, JWT_KEY);
  });

  it('should pad the key correctly to 64 characters in hexadecimal', () => {
    const keyHex = Crypto.getKeyHex(JWT_KEY);
    expect(keyHex).toHaveLength(64);
  });
});
