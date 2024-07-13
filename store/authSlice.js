import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    signIn: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { signIn, signOut, setUser } = authSlice.actions;

export const loadUser = () => async (dispatch) => {
  const userUID = await AsyncStorage.getItem('loggedInUserId');
  if (userUID) {
    dispatch(setUser(userUID));
  }
};

export const saveUser = (userUID) => async (dispatch) => {
  await AsyncStorage.setItem('loggedInUserId', userUID);
  dispatch(signIn(userUID));
};

export const removeUser = () => async (dispatch) => {
  await AsyncStorage.removeItem('loggedInUserId');
  dispatch(signOut());
};

export default authSlice.reducer;