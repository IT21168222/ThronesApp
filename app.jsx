import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import List from '@/components/List';
import ForgotPasswordScreen from '@/components/ForgotPasswordScreen';

const Stack = createStackNavigator();

const App = () => {

  return (
    
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="List" component={List} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}  options={{ headerShown: false }}/>
    </Stack.Navigator>

  );
};

export default App;