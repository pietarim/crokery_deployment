import axios from 'axios';

export const getRecipeImage = async (name: string) => {
  const response = await axios.get(`http://localhost:3001/api/images/${name}`);
  return response.data;
};