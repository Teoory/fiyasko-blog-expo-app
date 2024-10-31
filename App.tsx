import AppNavigator from './src/components/AppNavigator';
import { UserContextProvider } from './src/Hooks/UserContext';
import PushNotification from 'react-native-push-notification';

export default function App() {
  return (
    <UserContextProvider>
      <AppNavigator />
    </UserContextProvider>
  );
}