const port: string = process.env.PORT || '3001';
const databaseUrl: string = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@localhost:5432/postgres';
const url = process.env.SERVER_URL || 'http://localhost:3001';
let clientUrl;
const corsOriginClientUrl = process.env.CLIENT_URL || 'http://localhost:5432';

enum SameSite {
  Srtict = "strict",
  Lax = "lax",
  None = "none"
}

let sameSite: SameSite;
let cookieIsSecure: boolean;
const allowedCorsOrigins: string[] = [];

switch (process.env.NODE_ENV) {
  case 'production':
    sameSite = SameSite.Srtict;
    cookieIsSecure = true;
    allowedCorsOrigins.push(process.env.CLIENT_URL || 'http://localhost:5432');
    clientUrl = 'localhost';
    break;
  case 'development':
    sameSite = SameSite.None;
    cookieIsSecure = false;
    allowedCorsOrigins.push(corsOriginClientUrl);
    clientUrl = process.env.CLIENT_URL;
    break;
  default:
    sameSite = SameSite.Srtict;
    cookieIsSecure = true;
    allowedCorsOrigins.push(clientUrl);
    clientUrl = process.env.CLIENT_URL;
    break;
}

const config = {
  port,
  databaseUrl,
  url,
  clientUrl,
  sameSite,
  cookieIsSecure,
  allowedCorsOrigins
};

export default config;