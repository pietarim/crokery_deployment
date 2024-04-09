const port: string = process.env.PORT || '3001';
const databaseUrl: string = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@localhost:5432/postgres';
const url = process.env.SERVER_URL || 'http://localhost:3001';
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
    cookieUrl = 'localhost';
    break;
  case 'development':
    cookieIsSameSite = SameSite.None;
    cookieIsSecure = false;
    corsAllowedOrigins.push(corsOriginClientUrl);
    cookieUrl = process.env.CLIENT_URL;
    break;
  default:
    cookieIsSameSite = SameSite.Srtict;
    cookieIsSecure = true;
    corsAllowedOrigins.push(cookieUrl);
    cookieUrl = process.env.CLIENT_URL;
    break;
}

const config = {
  port,
  databaseUrl,
  url,
  cookieUrl,
  cookieIsSameSite,
  cookieIsSecure,
  corsAllowedOrigins
};

export default config;