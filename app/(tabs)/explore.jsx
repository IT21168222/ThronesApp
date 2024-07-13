import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../../firebase/firebaseConfig'
import { getDatabase,  get, set, ref as databaseRef, update} from 'firebase/database';
import {useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import SignIn from '@/components/SignIn';

export default function Profile() {
  const [name, setName] = useState("User's Name");
  const [email, setEmail] = useState('example@gmail.com');
  const [userId, setUserId] = useState();

  const handleLogout = async () => {
    // Remove the user's ID from AsyncStorage
    await AsyncStorage.removeItem('loggedInUserId');
    setName("User's Name");
    setEmail('example@gmail.com');
    console.log("User Logout Successfully!!!");
  };

  async function fetchLoggedInUserID() {
    const userUID = await AsyncStorage.getItem('loggedInUserId');
    // console.log('USER ID: ', userUID);
    setUserId(userUID);
  }
  

  const database = getDatabase(app);

  const userRef = databaseRef(database, `users/${userId}`);

  function dataFetch() {
    
      get(userRef)
          .then((snapshot) => {
              if (snapshot.exists()) {
                  // The data exists, and you can access it using snapshot.val()
                  const data = snapshot.val();
                  setName(data.name);
                  setEmail(data.email);
              } else {
                  console.log("No data available");
              }
          })
          .catch((error) => {
              console.error("Error fetching data:", error);
          });
  }

  useFocusEffect(
    useCallback(() => {
      fetchLoggedInUserID();
        dataFetch();
    }, [userId]));

  return (
    <>
    {userId ?

    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        editable = {false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable = {false}
      />
      <TouchableOpacity style={styles.button}  onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>

:  
  <SignIn />
}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#f0a500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    verticalAlign:'bottom',
    marginTop: 20,
    position: 'absolute',
    bottom: 25,  
    width: '100%',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 16,
  },
});