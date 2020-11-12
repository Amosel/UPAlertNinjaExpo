import React from "react";
import { StatusBar } from "react-native";
import { Root } from "./app/navigation";
import { AppProvider } from "./app/provider";
import { checkForAudio } from "./app/services/audio";
import { useKeepAwake } from "expo-keep-awake";

const App = () => {
  useKeepAwake();
  React.useEffect(() => {
    checkForAudio();
  }, []);
  React.useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );  
};

export default App;
