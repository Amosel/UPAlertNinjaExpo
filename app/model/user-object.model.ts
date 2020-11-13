import {UserObject} from '../types';

const keys = [
  'base_url',
  'consumer_key',
  'consumer_secret',
  'phone_number',
  'host',
  'plaform',
  'expoToken',
  'apnToken',
];

export function keysNeedingUpdate(current: Partial<UserObject>, next: {}) {
  if (!current) {
    return !!Object.keys(next).filter((key) => keys.includes(key));
  }
  return keys.filter(
    (key) => next[key] && (!current[key] || next[key] !== current[key]),
  );
}

export function hasChanges(
  current: Partial<UserObject> | undefined,
  next: Partial<UserObject>,
) {
  return keysNeedingUpdate(current, next).length > 0;
}
