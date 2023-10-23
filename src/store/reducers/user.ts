import {
  createAction,
  createAsyncThunk,
  createReducer,
} from '@reduxjs/toolkit';

import axios from 'axios';
import API_URL from '../../API_URL';


interface UserState {
  registered: boolean;
  token: string | null;
  logged: boolean;
  pseudo: string | null;
  userId: number | null;
}
export const initialState: UserState = {
  token: null,
  logged: false,
  pseudo: null,
  userId: null,
  registered: false,
};

// Action pour la déconnexion
export const logout = createAsyncThunk(`${API_URL}/logout`, async () => {
  localStorage.removeItem('token');
  location.href = '/';
  console.log('localstorage', localStorage);
  return false;
});

// Thunk pour la connexion
export const login = createAsyncThunk(
  '/login',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const objData = Object.fromEntries(formData);
      console.log('API_URL', API_URL);  

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { data } = await axios.post(`${API_URL}/login`, objData);
      console.log('data', data);
      // Après la connexion réussie, stockez le token dans le local storage
      localStorage.setItem('token', data.token);
      // Sauvegarder le pseudo et l'ID utilisateur dans le local storage lors de la connexion réussie
      localStorage.setItem('pseudo', data.pseudo);
      localStorage.setItem('userId', data.userId.toString());
      // Convertir en chaîne de caractères avant de stocker car pas de number dans le storage
      console.log('localstorage', localStorage);
      return data as {
        logged: boolean;
        pseudo: string;
        userId: number;
      };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Une erreur s'est produite lors de la connexion de l'utilisateur");
      }
    }
  }
);

export const initializeUser = createAction('user/initialize');

export const register = createAsyncThunk(
  '/register',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const objData = Object.fromEntries(formData);
      const { data } = await axios.post(`${API_URL}/register`, objData);
      return data as {
        registered: boolean;
        pseudo: string | null;
        userId: number | null;
      };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Une erreur s'est produite lors de l'enregistrement de l'utilisateur");
    }
  }
);

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(register.fulfilled, (state, action) => {
      state.registered = action.payload.registered;
      state.pseudo = action.payload.pseudo;
      state.userId = action.payload.userId;
      console.log('action.payload', action.payload);
    })
    .addCase(login.fulfilled, (state, action) => {
      state.logged = action.payload.logged;
      state.pseudo = action.payload.pseudo;
      state.userId = action.payload.userId;
      console.log('action.payload', action.payload);
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.logged = action.payload;
      state.pseudo = null;
      state.userId = null;
      localStorage.removeItem('pseudo');
      localStorage.removeItem('userId');
    })

    .addCase(initializeUser, (state) => {
      // Vérifiez si le token est présent dans le local storage et définissez l'état "logged" en conséquence
      const token = localStorage.getItem('token');
      state.logged = !!token;
      state.token = token;
      if (token) {
        // Si le token est présent, charger le pseudo et l'ID utilisateur depuis le local storage
        state.pseudo = localStorage.getItem('pseudo') || null;
        state.userId =
          parseInt(localStorage.getItem('userId') || '0', 10) || null;
      }
    });
});

export default userReducer;
