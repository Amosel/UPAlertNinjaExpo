import React from 'react';
import {View, Alert} from 'react-native';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {restoreApp, IApp} from './store';

const AppContext = React.createContext<IApp | null>(null);

export function useStore(): IApp {
  const store = React.useContext(AppContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
}

export function useOrdersStore() {
  return useStore().orders!;
}

export function useCredentials() {
  return useStore().credentials;
}

export type InitializationResult =
  | {success: true; app: IApp}
  | {success: false; error: string};

export type InitializationState =
  | {done: false}
  | {done: true; result: InitializationResult};

export function AppProvider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState<InitializationState>({
    done: false,
  });
  async function restore() {
    try {
      const app = await restoreApp();
      setState({done: true, result: {success: true, app}});
    } catch (error) {
      setState({
        done: true,
        result: {
          success: false,
          error: error.message || JSON.stringify(error),
        },
      });
    }
  }
  React.useEffect(() => {
    restore();
  }, []);

  if (state.done) {
    if (state.result.success) {
      const {app} = state.result;
      if (__DEV__) {
        // eslint-disable-next-line dot-notation
        window['app'] = app;
      }
      return (
        <ActionSheetProvider>
          <AppContext.Provider value={app}>{children}</AppContext.Provider>
        </ActionSheetProvider>
      );
    }
    if (state.result.success === false) {
      const {error} = state.result;
      console.error(error);
      Alert.alert('Failed', error);
    }
  }
  return <View />;
}
