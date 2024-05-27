import jwt from "jsonwebtoken";

export const accessTokenAge = 20000000;
export const refreshTokenAge = 60000000;

export function getTokens(login) {
  return {
    accessToken: jwt.sign({ login }, "token_access", {
      expiresIn: `${accessTokenAge}s`,
    }),
    refreshToken: jwt.sign({ login }, "token_refresh", {
      expiresIn: `${refreshTokenAge}s`,
    }),
  };
}
