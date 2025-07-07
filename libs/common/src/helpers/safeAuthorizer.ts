import * as basicAuth from 'express-basic-auth';

export function authorizer(username: string, password: string) {
  const userMatches = basicAuth.safeCompare(
    username,
    process.env.BULL_DASHBOARD_USER ?? 'admin',
  );
  const passwordMatches = basicAuth.safeCompare(
    password,
    process.env.BULL_DASHBOARD_PASSWORD ?? 'password123',
  );

  return userMatches && passwordMatches;
}
