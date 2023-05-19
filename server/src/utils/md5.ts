import crypto from 'crypto';

export function crypto_md5 (password: string) {
  const md5 = crypto.createHash('md5');
  return md5.update(password).digest('hex');
};
