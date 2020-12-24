import { Response } from "express";
import { RequestSession as Request } from "../types";
import allTurmas from "../utils/turmas";
import { preferenceName } from "../utils/strings";
import database from "../database/connection";
import turmas from "../json/turmas.json";
import * as jwt from "../setup/jwt";

export class info {
  static async userBasicInformations(req: Request, res: Response) {
    try {
      const { userID, tipo } = jwt.getDataToken(req);

      let response;

      await database(tipo)
        .where({ userID })
        .select("*")
        .then((rows) => {
          response = rows[0];
          delete response.userID;
        })
        .catch(() => {
          response = { error: true };
        });

      return res.json({ response });
    } catch (error) {
      res.status(500)
      console.log(error)
      return res.send({ error });
    }
  }

  static async allTurmas(req: Request, res: Response) {
    return res.json(turmas);
  }

  static async possibilyNames(req: Request, res: Response) {
    try {
      const { nome } = jwt.getDataToken(req);
      return res.json(preferenceName(nome));
    } catch (error) {
      res.status(401)
      return res.send(error);
    }
  }

  static async basicInformationRegister(req: Request, res: Response) {
    try {
      const { key } = req.query;
      let status = false;
      let retorno = <any>{};
      if (key) {
        let databaseResponse = await database("users")
          .select("userID", "name", "matricula", "tipo")
          .where({ key });

        if (databaseResponse.length == 1) {
          retorno = databaseResponse[0];
          if(retorno.tipo == "alunos") {
            databaseResponse = await database("alunos").select("curso").where({userID: retorno.userID})
            retorno.curso =  databaseResponse[0]["curso"]
            delete retorno.userID
          }
          status = true;
          retorno.turmas = allTurmas();
        }
      }

      return res.json({ status, ...retorno });
    } catch (error) {
      return res.status(401).send(error);
    }
  }
}
