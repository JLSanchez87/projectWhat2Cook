import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
const secret = "lasdkfjhaviaeuyrf3fadsf8usv";

interface TokenInfo extends JwtPayload {
  userId: number;
}

export const toToken = (data: TokenInfo) => {
  const token = jwt.sign(data, secret, { expiresIn: "10 days" });
  return token;
};

export const toData = (token: string) => {
  const data = jwt.verify(token, secret) as TokenInfo;
  return data;
};
