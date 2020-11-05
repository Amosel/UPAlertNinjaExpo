import CodePush from 'react-native-code-push';
import {types, SnapshotIn} from 'mobx-state-tree';
import {ENV} from '../../environment';

export const CodePushPackage = types.model({
  /**
   * The app binary version that this update is dependent on. This is the value that was
   * specified via the appStoreVersion parameter when calling the CLI's release command.
   */
  appVersion: types.string,

  /**
   * The deployment key that was used to originally download this update.
   */
  deploymentKey: types.string,

  /**
   * The description of the update. This is the same value that you specified in the CLI when you released the update.
   */
  description: types.string,

  /**
   * Indicates whether this update has been previously installed but was rolled back.
   */
  failedInstall: types.boolean,

  /**
   * Indicates whether this is the first time the update has been run after being installed.
   */
  isFirstRun: types.boolean,

  /**
   * Indicates whether the update is considered mandatory. This is the value that was specified in the CLI when the update was released.
   */
  isMandatory: types.boolean,

  /**
   * Indicates whether this update is in a "pending" state. When true, that means the update has been downloaded and installed, but the app restart
   * needed to apply it hasn't occurred yet, and therefore, its changes aren't currently visible to the end-user.
   */
  isPending: types.boolean,

  /**
   * The internal label automatically given to the update by the CodePush server. This value uniquely identifies the update within its deployment.
   */
  label: types.string,

  /**
   * The SHA hash value of the update.
   */
  packageHash: types.string,

  /**
   * The size of the code contained within the update, in bytes.
   */
  packageSize: types.number,
});

export const Env = types.model('Env', {
  codepush: types.maybeNull(CodePushPackage),
  credentials: types.model('EnvCredentials', {
    base_url: types.string,
    consumer_key: types.string,
    consumer_secret: types.string,
    phone_number: types.string,
  }),
  filter: types.enumeration(['last24Hours', 'all']),
  pageSize: types.number,
});

export async function getEnv(): Promise<SnapshotIn<typeof Env>> {
  if (__DEV__) {
    return ENV.dev;
  }
  const codepush = await CodePush.getUpdateMetadata();
  console.log(`CodePush.getUpdateMetadata: \n${JSON.stringify(codepush)}`);
  if (CodePushPackage.is(codepush)) {
    return {codepush, ...ENV.staging};
  } else {
    return ENV.staging;
  }
}
