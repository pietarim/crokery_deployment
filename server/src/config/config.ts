const port: string = process.env.PORT || '3001';
const databaseUrl: string = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@localhost:5432/postgres';
const url = process.env.SERVER_URL || 'http://localhost:3001';
const clientUrl = process.env.CLIENT_URL || 'localhost';

enum SameSite {
  Srtict = "strict",
  Lax = "lax",
  None = "none"
}

let sameSite: SameSite;
let cookieIsSecure: boolean;

switch (process.env.NODE_ENV) {
  case 'production':
    sameSite = SameSite.Srtict;
    cookieIsSecure = true;
    break;
  case 'development':
    sameSite = SameSite.None;
    cookieIsSecure = false;
    break;
  default:
    sameSite = SameSite.Srtict;
    cookieIsSecure = true;
    break;
}

const allowedOrigins = [url, 'http://127.0.0.1:5173', 'http://localhost:5173'];

const config = {
  port,
  databaseUrl,
  url,
  clientUrl,
  sameSite,
  cookieIsSecure,
  allowedOrigins
};

export default config;