import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {auth} from '../firebase/firebaseConfig';
import {TouchableOpacity } from 'react-native';
import {sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async() => {
    if (email === '') {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    await sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Success', 'Password reset email sent!');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={() => handlePasswordReset()}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginBottom: 40,
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
  },
  buttonText: {
    textAlign: 'center',
    color: '#1a1a1a',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
