const port: string = process.env.PORT || '3001';
const databaseUrl: string = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@localhost:5432/postgres';
const url = process.env.SERVER_URL || 'http://localhost:3000';

const config = {
  port,
  databaseUrl,
  url
};

export default config;