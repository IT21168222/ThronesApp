# ThronesApp - Mobile Application
## Overview
ThronesApp is a React Native application designed to provide a seamless and engaging user experience with various integrated features, including Firebase authentication and ThronesAPI integration.

## Technologies Used:
- React Native: For building the mobile application.
- Firebase: For authentication, database, and analytics.
- ThronesAPI: To fetch character data.

## Project Setup

### Prerequisites

- Node.js
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Firebase account

### Installation

Step 1: Clone the repository

```bash
git clone <git url>
```

Step 2: Install dependencies
```bash
cd ThronesApp
```
```bash
npm install
```

Step 3: Firebase Setup
- Create a Firebase project.
- Add an Android and/or iOS app to your Firebase project.
- Copy the configurations to the 'FirebaseConfig.js' file and place them in the appropriate directory.

Step 4: Configure Firebase
- Edit the firebaseConfig.js file with your Firebase project credentials.

Step 5: Run the project
```bash
npx react-native run-android
# or
npx react-native run-ios
```
