import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtAuthGuard implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) {
      this.unauthorized(res);
      return;
    }

    try {
      const payload = verify(
        token,
        this.configService.get<string>('JWT_SECRET', 'change-me') ??
          'change-me',
      ) as JwtPayload;
      req.user = { id: Number(payload.sub), email: payload.email };
      next();
    } catch {
      this.unauthorized(res);
    }
  }

  private unauthorized(res: Response) {
    res.status(401).json({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
}
