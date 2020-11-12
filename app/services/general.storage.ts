import AsyncStorage from '@react-native-community/async-storage';
import {Credentials} from '../types';

function getStoreKey(credentials: Credentials) {
  const Url = require('url-parse');
  const {host} = new Url(credentials.base_url);
  return `storage-${host}`;
}

const log = console.log;
let _payload: string;

export async function restoreStorage<T extends {}>(
  credentials: Credentials,
  wipeFirst: boolean = false,
): Promise<T | {}> {
  const storeKey = getStoreKey(credentials);
  const logs: string[] = [];
  let data = null;
  try {
    if (wipeFirst) {
      logs.push(`wiping storage: ${storeKey}`);
      await AsyncStorage.removeItem(storeKey);
      logs.push('wiped persisted storage');
    }
    logs.push(`Retrieving payload from ${storeKey}`);
    _payload = await AsyncStorage.getItem(storeKey);
    if (_payload) {
      data = JSON.parse(_payload) as T;
    }
    if (data) {
      logs.push(`Restored from previos session: ${Object.keys(data)}`);
    } else {
      logs.push('Restoring data to defaults');
      data = {};
    }
  } catch (error) {
    logs.push(
      `Failed restoring storage from disk, ${JSON.stringify(
        {error, data},
        null,
        2,
      )}`,
    );
    data = [];
  } finally {
    log('RestoreStorage:');
    logs.forEach((item) => log(` ${item}`));
    return data;
  }
}
export async function persistStorage<T extends {}>(
  credentials: Credentials,
  payload: string,
) {
  if (_payload === payload) {
    log('PersistStore: is same payload');
  }
  const storeKey = getStoreKey(credentials);
  const logs: string[] = [];
  if (payload) {
    try {
      await AsyncStorage.setItem(storeKey, payload);
      logs.push(`Persisted payload, ${payload} at ${storeKey}`);
    } catch (error) {
      logs.push('Failed persiting store', error);
    } finally {
      log('PersistStore:');
      logs.forEach((item) => log(` ${item}`));
    }
  }
}

export async function wipeStorage(credentials: Credentials) {
  const storeKey = getStoreKey(credentials);
  const logs: string[] = [];
  try {
    await AsyncStorage.removeItem(storeKey);
    logs.push('Wiped order ids');
  } catch (error) {
    logs.push('Failed persiting store', error);
  } finally {
    log('wipeOrderIds:');
    logs.forEach((item) => log(` ${item}`));
  }
}
