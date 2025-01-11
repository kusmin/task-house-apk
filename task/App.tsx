import React from 'react';
import AppNavigator from './navigation';
import theme from "./theme/theme";
import {PaperProvider} from "react-native-paper";

const App = () => {
  return (
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
  );
};

export default App;