import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
  user?: { id?: number; sub?: number; email?: string };
}
