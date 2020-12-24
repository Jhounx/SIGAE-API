import { Response, NextFunction } from "express";
import { RequestSession as Request } from "../types";
import * as jwt from './jwt'

const noPermission = { Permission: false };

export const needAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = jwt.getToken(req)
    const data = await <any>jwt.verify(token)
    if(data.tipo != "admins") return res.json(noPermission)
    return next()
  } catch (error) {
    return res.json(noPermission)
  }
}

export const needProf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = jwt.getToken(req)
    const data = await <any>jwt.verify(token)
    if(!["professores", "monitores", "admins"].includes(data.tipo)) res.status(401).json(noPermission)
    return next()
  } catch (error) {
    return res.status(401).json(noPermission)
  }
}

export const needLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = jwt.getToken(req)
    jwt.verify(token)
    return next()
  } catch (error) {
    return res.status(401).json(noPermission)
  }
}
