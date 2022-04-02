import jsSHA from 'jssha';
import dotenv from 'dotenv';
import path from 'path';

const envPath = '.env';
dotenv.config({path: path.normalize(envPath)});
const SALT = process.env.SECRETSALT;

export function getHash(unHashedString) {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(`${unHashedString}`);
  const hashed = shaObj.getHash('HEX');
  return hashed;
}

export function getSessionHash(userName) {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const sessionString = userName + SALT;
  shaObj.update (`${sessionString}`);
  const sessionHash = shaObj.getHash('HEX');
  return sessionHash;
}