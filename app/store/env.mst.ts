import {types, SnapshotIn, Instance} from 'mobx-state-tree';
import {ENV} from '../../environment';
import {Filter} from '../types';

export const ExpoPackage = types.model({
  /**
   * The app binary version that this update is dependent on. This is the value that was
   * specified via the appStoreVersion parameter when calling the CLI's release command.
   */
  version: types.string,
});

export const CredentialsModel = types.model('EnvCredentials', {
  base_url: types.string,
  consumer_key: types.string,
  consumer_secret: types.string,
  phone_number: types.string,
});

export const EnvModel = types.model('Env', {
  expo: ExpoPackage,
  credentials: CredentialsModel,
  filter: Filter,
  pageSize: types.number,
});

export type EnvType = Instance<typeof EnvModel>;
export type EnvSnapshot = SnapshotIn<typeof EnvModel>;

export async function getEnv(): Promise<EnvSnapshot> {
  if (__DEV__) {
    return {
      ...ENV.dev,
      expo: {
        version: 'dev',
      },
    };
  } else {
    return {
      ...ENV.staging,
      expo: {
        version: 'staging',
      },
    };
  }
}
