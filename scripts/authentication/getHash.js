import jsSHA from 'jssha';

export function getHash(unHashedString) {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(`${unHashedString}`);
  const hashed = shaObj.getHash('HEX');
  return hashed;
}