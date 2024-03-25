import axios from 'axios';
import { base_url } from '../config';

const baseUrl = base_url;

interface Credentials {
  username: string;
  password: string;
}

export const login = async (credentials: Credentials) => {
  const response = await axios.post(`${baseUrl}/auth/login`, credentials, { withCredentials: true });
  return response.data;
};

export const register = async (credentials: Credentials) => {
  const response = await axios.post(`${baseUrl}/auth/register`, credentials);
  return response.data;
};