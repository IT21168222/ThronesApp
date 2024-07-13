import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import List from '@/components/List';
import FlashMessage from 'react-native-flash-message';
import ForgotPasswordScreen from '@/components/ForgotPasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {

  const getUser = async () => {
    let userUID = await AsyncStorage.getItem('loggedInUserId');
    return userUID
  }

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