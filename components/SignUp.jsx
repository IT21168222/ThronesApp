import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebaseConfig';
import { showMessage } from 'react-native-flash-message';

export default function SignUp({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordCriteria = [
    { text: 'One lowercase character', isValid: /[a-z]/.test(password) },
    { text: 'One uppercase character', isValid: /[A-Z]/.test(password) },
    { text: '8 characters minimum', isValid: password.length >= 8 },
    { text: 'One number', isValid: /[0-9]/.test(password) },
  ];

  const errorMessages = {
    'auth/email-already-in-use': 'This email address is already in use.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'The password is too weak.',
    'auth/network-request-failed': 'Network error. Please try again later.',
    // Add more mappings as needed
  };

  const getErrorMessage = (errorCode) => {
    return errorMessages[errorCode] || 'An unknown error occurred. Please try again.';
  };

  const register = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data in the Realtime Database
      await set(ref(database, 'users/' + user.uid), {
        name: name,
        email: email
      });

      Alert.alert(
        'Registration Successful',
        'You have successfully registered. Please sign in to continue.',
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );

      setErrorMessage(''); // Clear any previous error messages

      // showMessage({
      //   message: 'Registration Successful',
      //   description: 'You have successfully registered. Please sign in to continue.',
      //   type: 'success',
      //   icon: 'success',
      //   duration: 3000,
      //   onPress: () => {
      //     navigation.navigate('SignIn');
      //   },
      // });
      
      console.log('User registered successfully!');
    } catch (error) {
      setErrorMessage(getErrorMessage(error.code));
      console.error('Error creating user:', error.message);
    }
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
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
      <View style={styles.passwordCriteriaContainer}>
        {passwordCriteria.map((criteria, index) => (
          <Text
            key={index}
            style={[
              styles.passwordCriteriaText,
              criteria.isValid ? styles.valid : styles.invalid,
            ]}
          >
            {criteria.text}
          </Text>
        ))}
      </View>
      <TouchableOpacity style={styles.button}  onPress={() => register()}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInLink}>Sign In</Text>
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
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    color: '#fff',
    padding: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  eyeText: {
    color: '#aaa',
    fontSize: 19,
  },
  passwordCriteriaContainer: {
    marginBottom: 20,
  },
  passwordCriteriaText: {
    color: '#aaa',
  },
  valid: {
    textDecorationLine: 'line-through',
    color: 'green',
  },
  invalid: {
    textDecorationLine: 'none',
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    color: '#aaa',
  },
  signInLink: {
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