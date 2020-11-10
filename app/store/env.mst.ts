import { types, SnapshotIn, Instance } from "mobx-state-tree";
import { ENV } from "../../environment";

export const ExpoPackage = types.model({
  /**
   * The app binary version that this update is dependent on. This is the value that was
   * specified via the appStoreVersion parameter when calling the CLI's release command.
   */
  version: types.string,

});

export const EnvModel = types.model("Env", {
  expo: ExpoPackage,
  credentials: types.model("EnvCredentials", {
    base_url: types.string,
    consumer_key: types.string,
    consumer_secret: types.string,
    phone_number: types.string,
  }),
  filter: types.enumeration(["last24Hours", "all"]),
  pageSize: types.number,
});

export type EnvType = Instance<typeof EnvModel>;

export async function getEnv(): Promise<SnapshotIn<typeof EnvModel>> {
  if (__DEV__) {
    return ENV.dev;
  } else {
    return ENV.staging
  }
}
