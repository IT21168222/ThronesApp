import SignIn from '@/components/SignIn';
import List from '@/components/CharacterDetails';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import {useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function Home() {

  const [userId, setUserId] = useState();

  async function fetchLoggedInUserID() {
    const userUID = await AsyncStorage.getItem('loggedInUserId');
    // console.log('USER ID: ', userUID);
    setUserId(userUID);
  }
 console.log("Home")
 useFocusEffect(
    useCallback(() => {
      fetchLoggedInUserID();
    }, [userId]));


  return (
    <Stack.Navigator>
      {userId ?
        <Stack.Screen name="List" component={List} options={{ headerShown: false }} />
        :
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      }
    </Stack.Navigator>

  );
};