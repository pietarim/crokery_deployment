/* import * as express from 'express'; */
/* import { Requst } from 'express';
import { Express } from "express-serve-static-core"; */
import { TokenUser } from '../types';

// to make the file a module and avoid the TypeScript error
export { };

declare global {
  namespace Express {
    export interface Request {
      user: TokenUser;
      query: { page: string; };
    }
  }
}
