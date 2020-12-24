import { Response, Request } from "express";
import database from "../../database/connection";
import md5 from "md5";
import verify from "../../utils/registerVerifys";
import * as jwt from "../../setup/jwt";
import databaseCommit from "../../database/databaseCommit";

export default class {
  static async userInformations(req: Request, res: Response) {
    const trx = await database.transaction()

    try {
      const { tipo, userID, nome } = jwt.getDataToken(req);
      //@ts-ignore
      const userUpdate = <any>{};
      const typeTableUpdate = <any>{};
      const errorJson = <any>{};
      const databaseQuerys = [];
      let status = false;

      const {
        nomePreferencia,
        email,
        password,
        turma,
        materias,
        departamento,
      } = req.body;

      if (nomePreferencia) {
        if (verify.nomePreferencia(nomePreferencia, nome))
          userUpdate.nomePreferencia = nomePreferencia;
        else errorJson.nomePreferencia = true;
      }

      if (email) {
        if (verify.email(email)) userUpdate.email = email;
        else errorJson.emailExist = true;
      }

      if (password) {
        if (verify.senha(password)) userUpdate.password = md5(password);
        else errorJson.password = true;
      }

      /*if (tipo == "alunos" && turma) {
        if (verify.turma(turma)) typeTableUpdate.turma = turma;
        else errorJson.turma = true;
      }*/

      if (["professores", "monitores"].includes(tipo)) {
        if (materias && typeof materias == typeof {}) {
          if (materias.add && typeof materias.add == typeof []) {
            const lista = materias.add;
            const insertList = Object.values(lista).map((materiaID) => ({
              materiaID,
              userID,
            }));

            databaseQuerys.push(
              trx("materias_professores").insert(insertList)
            );
          }
          if (materias.down && typeof materias.down == typeof []) {
            databaseQuerys.push(
              trx("materias_professores")
                .where({ userID })
                .orWhereIn("materiaID", materias.down)
                .del()
            );
          }
        }

        if (departamento) {
          databaseQuerys.push(
            trx(tipo).where({ userID }).update({ departamento })
          );
        }
      }

      if (Object.keys(userUpdate).length != 0) {
        databaseQuerys.push(
          trx("user").where({ userID }).update(userUpdate)
        );
      }

      if (Object.keys(typeTableUpdate).length != 0) {
        databaseQuerys.push(
          trx(tipo).where({ userID }).update(typeTableUpdate)
        );
      }

      if (databaseQuerys.length != 0) {
        status = await databaseCommit(databaseQuerys)
      }
      await trx.commit()
      return res.json({ status, ...errorJson });
    } catch (error) {
      await trx.rollback()
      res.status(500)
      console.log(error)
      return res.json({status: false, error: error})
    }
  }
}
