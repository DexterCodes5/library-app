export const oktaConfig = {
  clientId: "YOUR_CLIENT_ID",
  issuer: "YOUR_ISSUER",
  redirectUri: "https://localhost:3000/login/callback",
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: true,
};