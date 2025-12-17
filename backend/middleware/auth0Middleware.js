import { auth } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
  audience: "https://staybnb-api/",
  issuerBaseURL: "https://dev-u34emqv2lh0qdxoi.us.auth0.com/",
  tokenSigningAlg: "RS256",
});
