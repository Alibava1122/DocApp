import React, { useEffect } from 'react';
import { Alert, BackHandler, Linking } from 'react-native';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import moment from 'moment';
import { PersistGate } from 'redux-persist/integration/react';
import Drawer from './src/navigation/DrawerNavigator';
import EStyleSheet from 'react-native-extended-stylesheet';
import { store, persistor } from './src/redux/store';
import NavigationService from './src/navigation/NavigationService';
import { RootSiblingParent } from 'react-native-root-siblings';
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-community/async-storage';

EStyleSheet.build({
  $primaryColor: '#008577',
  $primaryColorDark: '#00574B',
});

console.disableYellowBox = true;
const Container = createAppContainer(Drawer);

export default function App() {
  useEffect(() => {
    setTimeout(checkUpdateNeeded, 400);
  }, []);

  const checkUpdateNeeded = async () => {
    try {
      const updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded.isNeeded) {
        const [lastCheckTime, lastCheckVersion] = await Promise.all([
          AsyncStorage.getItem('lastCheckTime'),
          AsyncStorage.getItem('lastCheckVersion'),
        ]);
        if (
          lastCheckTime &&
          lastCheckVersion &&
          lastCheckVersion === updateNeeded.latestVersion &&
          moment().diff(moment(lastCheckTime), 'days') < 7
        ) {
          return;
        }
        Alert.alert(
          'Update App',
          `A new version for this app is available! You have version ${updateNeeded.currentVersion}. The latest version is ${updateNeeded.latestVersion}.\n\nWould you like to update the app now?`,
          [
            {
              text: 'Later',
              onPress: () => {
                Promise.all([
                  AsyncStorage.setItem('lastCheckTime', moment().toISOString()),
                  AsyncStorage.setItem(
                    'lastCheckVersion',
                    updateNeeded.latestVersion,
                  ),
                ]);
              },
            },
            {
              text: 'Update',
              onPress: () => {
                Promise.all([
                  AsyncStorage.removeItem('lastCheckTime'),
                  AsyncStorage.removeItem('lastCheckVersion'),
                ]).finally(() => {
                  BackHandler.exitApp();
                  Linking.openURL(updateNeeded.storeUrl);
                });
              },
            },
          ],
          { cancelable: false },
        );
      }
    } catch (error) {}
  };
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootSiblingParent>
          <Container
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
}
