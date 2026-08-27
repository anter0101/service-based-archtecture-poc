import { createServer, type Server } from 'node:http';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { App } from 'supertest/types';
import { GatewayModule } from '../src/gateway.module';

describe('Gateway auth proxy (e2e)', () => {
  let app: INestApplication<App>;
  let upstream: Server;
  let upstreamPort: number;
  const secret = 'change-me';

  beforeAll(async () => {
    upstream = createServer((req, res) => {
      res.setHeader('content-type', 'application/json');
      if (req.method === 'POST' && req.url?.startsWith('/auth/login')) {
        res.end(
          JSON.stringify({
            accessToken: 'identity-token',
            user: { id: 1, email: 'ada@example.com' },
          }),
        );
        return;
      }
      if (req.method === 'POST' && req.url?.startsWith('/auth/register')) {
        res.statusCode = 201;
        res.end(
          JSON.stringify({
            accessToken: 'identity-token',
            user: { id: 1, email: 'ada@example.com', name: 'Ada' },
          }),
        );
        return;
      }
      if (req.method === 'GET' && req.url?.startsWith('/users/me')) {
        res.end(
          JSON.stringify({ id: 1, email: 'ada@example.com', name: 'Ada' }),
        );
        return;
      }
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'not found', path: req.url }));
    });

    await new Promise<void>((resolve) => {
      upstream.listen(0, '127.0.0.1', () => {
        const address = upstream.address();
        upstreamPort =
          typeof address === 'object' && address ? address.port : 0;
        resolve();
      });
    });

    process.env.JWT_SECRET = secret;
    process.env.IDENTITY_SERVICE_URL = `http://127.0.0.1:${upstreamPort}`;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await new Promise<void>((resolve, reject) => {
      upstream.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('proxies login without a JWT', () => {
    return request(app.getHttpServer())
      .post('/api/identity/auth/login')
      .send({ email: 'ada@example.com', password: 's3cretPass' })
      .expect(200)
      .expect((res: { body: { accessToken?: string } }) => {
        expect(res.body.accessToken).toBe('identity-token');
      });
  });

  it('proxies register without a JWT', () => {
    return request(app.getHttpServer())
      .post('/api/identity/auth/register')
      .send({
        name: 'Ada',
        email: 'ada@example.com',
        password: 's3cretPass',
      })
      .expect(201);
  });

  it('rejects a protected route without a JWT', () => {
    return request(app.getHttpServer())
      .get('/api/identity/users/me')
      .expect(401);
  });

  it('rejects a protected route with an invalid JWT', () => {
    return request(app.getHttpServer())
      .get('/api/identity/users/me')
      .set('Authorization', 'Bearer not-a-token')
      .expect(401);
  });

  it('proxies a protected route with a valid JWT', () => {
    const token = sign({ sub: '1', email: 'ada@example.com' }, secret, {
      expiresIn: '15m',
    });

    return request(app.getHttpServer())
      .get('/api/identity/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ id: 1, email: 'ada@example.com', name: 'Ada' });
  });
});
