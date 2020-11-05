import React from 'react';
import {Keyboard} from 'react-native';

export function useKeyboard(): boolean {
  const [keyboardShowing, setKeyboardIsShowing] = React.useState<boolean>(
    false,
  );
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardIsShowing(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardIsShowing(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return keyboardShowing;
}
