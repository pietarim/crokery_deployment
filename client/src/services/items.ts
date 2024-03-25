import axios from 'axios';

export const getItems = async () => {
  const response = await axios.get('http://localhost:3001/api/items');
  return response.data;
};