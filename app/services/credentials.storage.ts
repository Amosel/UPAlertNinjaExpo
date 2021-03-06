// import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-community/async-storage';
import {Credentials} from '../types';
import {CredentialsHelper} from '../model';

export const CREDENTIALS = 'Credentials';

const log = console.log;
// const log = (_message?: any, ..._optionalParams: any[]) => {};

interface StorageService {
  delete(key: string): Promise<void>;
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string>;
}

// const service: StorageService = {
//   delete: SecureStore.deleteItemAsync,
//   set: SecureStore.setItemAsync,
//   get: SecureStore.getItemAsync,
// }

const service: StorageService = {
  delete: AsyncStorage.removeItem,
  set: AsyncStorage.setItem,
  get: AsyncStorage.getItem,
};

export async function wipeCredentials() {
  try {
    await service.delete(CREDENTIALS);
    log('wiped persisted credentials');
  } catch (error) {
    console.error('Failed Wiping credentials', error);
  }
}

export const persistCredentials = async (payload: Credentials) => {
  try {
    await service.set(CREDENTIALS, JSON.stringify(payload));
    log('Persisted credentials');
  } catch (error) {
    console.error('Failed Persisting credentials', error);
  }
};

let credentials: Credentials | null = null;

export async function restoreCredentials(
  wipeFirst: boolean = false,
): Promise<Credentials | null> {
  if (credentials) {
    return credentials;
  }
  try {
    if (wipeFirst) {
      log('Wiping credentials from previous session');
      await wipeCredentials();
    }
    const data = await service.get(CREDENTIALS);

    if (data) {
      log('Restored credentials data from previous session');
      if (CredentialsHelper.isValidCredentials(JSON.parse(data))) {
        credentials = JSON.parse(data);
      } else {
        log(`Restored credentials that are invalid, ${data} returning null`);
      }
    } else {
      log('No credentials found on disk');
    }
  } catch (error) {
    log('Failed restoring credentials from disk', error);
  } finally {
    log(
      credentials
        ? `Restored credentials are ${JSON.stringify(credentials)}`
        : 'No Credentials restored',
    );
    return credentials;
  }
}
