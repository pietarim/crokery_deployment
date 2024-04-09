const port: string = process.env.PORT || '3001';
const databaseUrl: string = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@localhost:5432/postgres';
let cookieUrl;
const corsOriginClientUrl = process.env.CLIENT_URL || 'http://localhost:5432';

enum SameSite {
  Srtict = "strict",
  Lax = "lax",
  None = "none"
}

let cookieIsSameSite: SameSite;
let cookieIsSecure: boolean;
const corsAllowedOrigins: string[] = [];

switch (process.env.NODE_ENV) {
  case 'production':
    cookieIsSameSite = SameSite.Srtict;
    cookieIsSecure = true;
    corsAllowedOrigins.push(process.env.CLIENT_URL || 'http://localhost:5432');
    cookieUrl = process.env.SERVER_URL;
    break;
  case 'development':
    cookieIsSameSite = SameSite.None;
    cookieIsSecure = false;
    corsAllowedOrigins.push(corsOriginClientUrl, process.env.SERVER_URL);
    cookieUrl = 'localhost';
    break;
  default:
    cookieIsSameSite = SameSite.None;
    cookieIsSecure = false;
    corsAllowedOrigins.push(corsOriginClientUrl, process.env.SERVER_URL);
    cookieUrl = 'localhost';
    break;
}

const config = {
  port,
  databaseUrl,
  cookieUrl,
  cookieIsSameSite,
  cookieIsSecure,
  corsAllowedOrigins
};

export default config;