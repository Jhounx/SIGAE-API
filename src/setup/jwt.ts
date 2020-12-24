import jwt from "jsonwebtoken";
import { Request } from "express";

interface token {
  tipo: string; 
  userID: string; 
  nome: string;
}

const privateKey = "23qwse9jfASDwpnf09sadf27298asnfl2518JKS06ASDF87";

export const sign = (data: object) => jwt.sign(data, privateKey);

export const verify = (token: string) => jwt.verify(token, privateKey);

export const getToken = (req: Request) => {
  //@ts-ignore
  const [, token] = req.headers.authorization.split(" ");
  return token;
};

export const getDataToken = (req: Request) => {
  const token = getToken(req)
  return <token>verify(token)
}
