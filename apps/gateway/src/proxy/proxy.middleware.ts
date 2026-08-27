import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ServiceRouter } from '../routing/service-router';

const HOP_BY_HOP = new Set([
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(private readonly router: ServiceRouter) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = (req.originalUrl ?? req.url).split('?')[0] ?? req.path;
    const route = this.router.resolve(path);

    if (!route || route.handledByModule) {
      next();
      return;
    }

    const target = `${this.router.getTargetUrl(route.service)}${req.originalUrl}`;
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (!value || HOP_BY_HOP.has(key.toLowerCase())) {
        continue;
      }
      headers.set(key, Array.isArray(value) ? value.join(',') : value);
    }

    const method = req.method.toUpperCase();
    const init: RequestInit = { method, headers };
    if (!['GET', 'HEAD'].includes(method) && req.body != null) {
      init.body =
        typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json');
      }
    }

    try {
      const upstream = await fetch(target, init);
      res.status(upstream.status);
      upstream.headers.forEach((value, key) => {
        if (!HOP_BY_HOP.has(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });
      res.send(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      if (!res.headersSent) {
        res.status(502).json({
          statusCode: 502,
          message: `Upstream ${route.service} is unavailable`,
        });
      }
    }
  }
}
