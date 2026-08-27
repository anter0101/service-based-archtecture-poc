import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import {
  matchServiceRoute,
  pathnameOf,
  targetUrlFor,
  type ServiceRoute,
} from '../routing/service-routes';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly handlers = new Map<string, RequestHandler>();

  use(req: Request, res: Response, next: NextFunction) {
    const pathname = pathnameOf(req.originalUrl ?? req.url);
    const route = matchServiceRoute(pathname);
    if (!route) {
      next();
      return;
    }

    this.handlerFor(route)(req, res, next);
  }

  private handlerFor(route: ServiceRoute): RequestHandler {
    const cached = this.handlers.get(route.prefix);
    if (cached) {
      return cached;
    }

    const escapedPrefix = route.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const handler = createProxyMiddleware({
      target: targetUrlFor(route),
      changeOrigin: true,
      logLevel: 'silent',
      pathRewrite: { [`^${escapedPrefix}`]: '' },
      onProxyReq: (proxyReq, incoming) => {
        const method = incoming.method?.toUpperCase();
        if (!method || ['GET', 'HEAD'].includes(method)) {
          return;
        }
        const body = (incoming as Request).body as unknown;
        if (body == null || typeof body !== 'object') {
          return;
        }
        const payload = JSON.stringify(body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(payload));
        proxyReq.write(payload);
      },
      onError: (_err, _incoming, outgoing) => {
        const response = outgoing as Response;
        if (!response.headersSent) {
          response.status(502).json({
            statusCode: 502,
            message: 'Upstream service is unavailable',
          });
        }
      },
    });

    this.handlers.set(route.prefix, handler);
    return handler;
  }
}
