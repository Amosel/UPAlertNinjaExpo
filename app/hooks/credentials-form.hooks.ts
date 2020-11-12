import React from 'react';
import {getSnapshot} from 'mobx-state-tree';
import {CredentialsHelper} from '../model';
import {CredentialEntryName, Credentials} from '../types';
import {useStore} from '../provider';

export function useCredentialForm() {
  const store = useStore();
  const [userInput, setState] = React.useState<Credentials>(
    (store.credentials && getSnapshot(store.credentials)) ||
      getSnapshot(store.env.credentials),
  );
  // 'derived' state is done with useMemo:
  const canSave = React.useMemo(
    () => CredentialsHelper.isValidCredentials(userInput),
    [userInput],
  );
  const handleChange = React.useCallback(
    (entry: CredentialEntryName) => (input: string) => {
      setState((state) => ({
        ...state,
        [entry]: input,
      }));
    },
    [],
  );
  return {
    userInput,
    handleChange,
    canSave,
    // must be valid at this points
    onPress() {
      store.setCredentials(userInput);
    },
  };
}
