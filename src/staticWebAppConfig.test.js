import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readStaticWebAppConfig = () => JSON.parse(
  readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8'),
);

const findRoute = (config, route) => config.routes.find((item) => item.route === route);

describe('Static Web Apps access protection', () => {
  it('limits the app and API to the personal owner role', () => {
    const config = readStaticWebAppConfig();

    expect(findRoute(config, '/api/*')?.allowedRoles).toEqual(['creator_owner']);
    expect(findRoute(config, '/*')?.allowedRoles).toEqual(['creator_owner']);
  });

  it('keeps Azure auth endpoints and the access-denied page reachable', () => {
    const config = readStaticWebAppConfig();

    expect(findRoute(config, '/.auth/*')?.allowedRoles).toEqual(['anonymous']);
    expect(findRoute(config, '/access-denied.html')?.allowedRoles).toEqual(['authenticated']);
    expect(config.responseOverrides['401'].redirect).toContain('/.auth/login/aad');
    expect(config.responseOverrides['403'].redirect).toBe('/access-denied.html');
  });
});
