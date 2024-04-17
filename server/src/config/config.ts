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
let imageProjectPath: string;

switch (process.env.NODE_ENV) {
  case 'production':
    cookieIsSameSite = SameSite.Srtict;
    cookieIsSecure = true;
    corsAllowedOrigins.push(process.env.CLIENT_URL || 'http://localhost:5432');
    cookieUrl = process.env.SERVER_URL;
    imageProjectPath = "../images/";
    break;
  case 'development':
    cookieIsSameSite = SameSite.None;
    cookieIsSecure = false;
    corsAllowedOrigins.push(corsOriginClientUrl, process.env.SERVER_URL);
    cookieUrl = 'localhost';
    imageProjectPath = "../../images/";
    break;
  default:
    cookieIsSameSite = SameSite.None;
    cookieIsSecure = false;
    corsAllowedOrigins.push(corsOriginClientUrl, process.env.SERVER_URL);
    cookieUrl = 'localhost';
    imageProjectPath = "../../images/";
    break;
}

const config = {
  port,
  databaseUrl,
  cookieUrl,
  cookieIsSameSite,
  cookieIsSecure,
  corsAllowedOrigins,
  imageProjectPath
};

export default config;