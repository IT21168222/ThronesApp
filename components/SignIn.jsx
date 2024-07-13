import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import {signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleSignIn = async () => {
    setErrorMessage('');
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const userUID = user.uid;
      console.log('User logged in successfully:', user.email);

      // Store user UID in AsyncStorage for future reference
      await AsyncStorage.setItem('loggedInUserId', userUID);

      // Navigate to another screen or perform any action after login
      navigation.navigate('Home');

    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage(getErrorMessage(error.code));
    }
  };

  const errorMessages = {
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/user-not-found': 'No user found with this email address.',
    'auth/missing-password': 'Please enter the password.',
    'auth/invalid-credential': 'Please check your credentials!.',
    // Add more mappings as needed
  };
  
  const getErrorMessage = (errorCode) => {
    return errorMessages[errorCode] || 'An error occurred. Please try again later.';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        >
          <Text style={styles.eyeText}>{secureTextEntry ? '🙈' : '🙉'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleSignIn()}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 5,
  },
  inputPassword: {
    flex: 1,
    color: '#fff',
    padding: 10,
  },
  eyeIcon: {
    padding: 15,
  },
  eyeText: {
    color: '#aaa',
    fontSize: 19,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#aaa',
  },
  button: {
    backgroundColor: '#f0a500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#aaa',
  },
  signUpLink: {
    color: '#f0a500',
    marginLeft: 5,
  },
  errorContainer: {
    backgroundColor: '#F8D7DA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: '#721C24',
    textAlign: 'center',
  },
});