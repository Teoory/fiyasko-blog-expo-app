import AppNavigator from './src/components/AppNavigator';
import { UserContextProvider } from './src/Hooks/UserContext';

export default function App() {
  return (
    <UserContextProvider>
      <AppNavigator />
    </UserContextProvider>
  );
}