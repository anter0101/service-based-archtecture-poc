import { RequestMethod } from '@nestjs/common';
import {
  isPublicRoute,
  jwtExcludeRoutes,
  matchServiceRoute,
  rewritePath,
} from './service-routes';

describe('service-routes', () => {
  const route = matchServiceRoute('/api/identity/auth/login');

  it('matches the identity prefix', () => {
    expect(route?.prefix).toBe('/api/identity');
    expect(route?.service).toBe('identity');
  });

  it('rewrites the public API path to the identity path', () => {
    expect(rewritePath('/api/identity/auth/login', route!)).toBe('/auth/login');
    expect(rewritePath('/api/identity/users/me', route!)).toBe('/users/me');
  });

  it('keeps login and register public', () => {
    expect(isPublicRoute('POST', '/api/identity/auth/login', route!)).toBe(
      true,
    );
    expect(isPublicRoute('POST', '/api/identity/auth/register', route!)).toBe(
      true,
    );
  });

  it('requires JWT for user routes', () => {
    expect(isPublicRoute('GET', '/api/identity/users/me', route!)).toBe(false);
    expect(isPublicRoute('GET', '/api/identity/users', route!)).toBe(false);
  });

  it('excludes login and register from JWT middleware', () => {
    expect(jwtExcludeRoutes()).toEqual(
      expect.arrayContaining([
        { path: 'api/identity/auth/login', method: RequestMethod.POST },
        { path: 'api/identity/auth/register', method: RequestMethod.POST },
      ]),
    );
  });
});
