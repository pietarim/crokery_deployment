/* interface IConfig {
  API_URI: string;
} */

/* const devConfig: IConfig = {
  API_URI: import.meta.env.VITE_API_URI || 'http://localhost:3001',
};

const prodConfig: IConfig = {
  API_URI: process.env.REACT_PROD_API_URI || 'https://www.my-app.herokuapp.com',
}; */

export const base_url = import.meta.env.VITE_API_URI || 'http://localhost:3001';

/* export const base_url = import.meta.env.VITE_API_URI || 'http://localhost:3001'; */

/* const API_URI = process.env.NODE_ENV === 'production' ? prodConfig.API_URI : devConfig.API_URI;
export default API_URI; */