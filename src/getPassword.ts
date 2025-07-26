import { configuration } from './config';

export function getPassword(hash: string) {
  return `${hash}${configuration.pepper}`;
}
