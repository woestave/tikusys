import { range } from 'ramda';

/**
 * 'ABCDEFG....XYZ'
 */
const aToZ = String.fromCharCode.apply(null, range(65, 91));
export function getAToZ (index: number) {
  return aToZ[index];
}

