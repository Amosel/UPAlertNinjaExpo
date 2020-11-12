import {
  // restoreFromPersistnce,
  restoreFromPersistence,
  StoreInSnapshot,
  initialSnapsot,
} from './orders.mst';
import {Credentials} from '../../types';
import {restoreStorage} from '../../services/general.storage';

const log = console.log;

export async function restoreOrderStore(
  credentials: Credentials,
  wipe = false,
): Promise<StoreInSnapshot> {
  let logs: string[] = [];

  let snapshot = initialSnapsot;
  try {
    const data = await restoreStorage(credentials, wipe);
    // never throws
    if (data) {
      snapshot = restoreFromPersistence(data);
    }
    logs.push(`Restoreed snapshot: ${JSON.stringify(snapshot, null, 2)}`);
  } catch (error) {
    logs.push(`Failed restoring snapshot data, ${error}`);
  } finally {
    log('Initialize store snapshot:');
    logs.forEach((item) => log(` ${item}`));
    return snapshot;
  }
}
