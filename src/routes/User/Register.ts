import { Response, Request } from "express";
import database from "../../database/connection";
import { makeid } from "../../utils/strings";
import { uuid } from "uuidv4";
import md5 from "md5";
import verify from "../../utils/registerVerifys";
import databaseCommit from "../../database/databaseCommit";

interface basicUserInterface {
  errorMatricula?: boolean;
  errorName?: boolean;
  errorTipo?: boolean;
  key?: string;
  noPermission: boolean;
  matriculaDuplicated?: boolean;
  errorCurso?: boolean;
  errorCampus?: boolean;
  departamentoError?: boolean;
}

interface fullUserInterface {
  errorTurma?: boolean;
  weakPassword?: boolean;
  errorEmail?: boolean;
  errorKey?: boolean;
  errorPreferencia?: boolean;
  errorDobleMail?: boolean;
  errorWasComplete?: boolean;
  materiasTypeError?: boolean;
}

export default class {
  static async registFull(req: Request, res: Response) {
    const trx = await database.transaction();
    try {
      const {
        password,
        email,
        nomePreferencia,
        key,
        turma,
        materias,
      } = req.body;
      let create = false;
      let errors = <fullUserInterface>{};
      if (password && email && nomePreferencia && key) {
        let dataBaseResponse = await trx("users").select("*").where({ key });
        if (!verify.senha(password)) errors.weakPassword = true;
        if (!(await verify.email(String(email), trx))) errors.errorEmail = true;
        if (dataBaseResponse.length == 0) errors.errorKey = true;
        if (
          dataBaseResponse.length != 0 &&
          !verify.nomePreferencia(nomePreferencia, dataBaseResponse[0]["nome"])
        )
          errors.errorPreferencia = true;
        if (
          dataBaseResponse.length != 0 &&
          dataBaseResponse[0]["complete"] != 0
        )
          errors.errorWasComplete = true;
        if (
          dataBaseResponse[0] &&
          dataBaseResponse[0]["tipo"] == "alunos" &&
          !turma
        )
          errors.errorTurma = true;
        if (
          dataBaseResponse[0] &&
          ["professores", "monitores"].includes(dataBaseResponse[0]["tipo"])
        ) {
          if (
            !materias ||
            !verify.materias(materias, dataBaseResponse[0]["campus"])
          )
            errors.materiasTypeError = true;
        }

        if (Object.keys(errors).length == 0) {
          const user = dataBaseResponse[0];
          const type = user.tipo;
          const databaseQuerys = [];

          databaseQuerys.push(
            trx("users")
              .update({
                password: md5(password),
                email,
                complete: 1,
                nomePreferencia,
              })
              .where({ key })
          );

          if (type == "alunos") {
            //
            let databaseResponse = await trx("alunos")
              .select("curso")
              .where({ userID: user.userID });
            //@ts-ignore
            if (
              databaseResponse &&
              verify.turma(turma, databaseResponse[0]["curso"], user.campus)
            ) {
              databaseQuerys.push(
                trx("alunos")
                  .update({
                    turma,
                  })
                  .where({ userID: user.userID })
              );
            } else errors.errorTurma = false;
          } else if (["professores", "monitores"].includes(type)) {
            const inserMaterias = Object.values(materias).map((materia) => ({
              materia,
              userID: user.userID,
            }));

            databaseQuerys.push(
              trx("materias_docentes").insert(inserMaterias)
            );
          }
          if (Object.keys(errors).length == 0) {
            create = await databaseCommit(databaseQuerys);
          }
        }
      }
      await trx.commit();
      return res.json({ create, ...errors });
    } catch (error) {
      await trx.rollback();
      console.log(error);
      res.status(500);
      return res.send(error);
    }
  }

  static async createBasicUser(req: Request, res: Response) {
    const trx = await database.transaction();
    try {
      const { nome, matricula, tipo, campus, curso, departamento } = req.body;

      let create = false;
      let errors = <basicUserInterface>{};
      if (nome && matricula && tipo && campus) {
        if (String(matricula).length != 11 && String(matricula).length != 6)
          errors.errorMatricula = true;
        let databaseResponse = await trx("users")
          .select("matricula")
          .where({ matricula });
        if (databaseResponse.length != 0) errors.matriculaDuplicated = true;
        if (String(nome).split(" ").length < 3) errors.errorName = true;
        if (!["ALU", "ADM", "PRO", "MON"].includes(tipo))
          errors.errorTipo = true;
        if (!verify.campus(campus)) errors.errorCampus = true;
        if (tipo == "ALU" && (!curso || !verify.curso(curso)))
          errors.errorCurso = true;
        if (
          ["PRO", "MON"].includes(tipo) &&
          (!departamento || !verify.departamento(departamento))
        )
          errors.departamentoError = true;

        if (Object.keys(errors).length == 0) {
          const databaseQuerys = [];
          let loop = true;
          let key;

          const userTypeTables = {
            ALU: "alunos",
            ADM: "admins",
            PRO: "professores",
            MON: "monitores",
          };

          //@ts-ignore
          const userType = userTypeTables[tipo];
          const userID = uuid();
          while (loop) {
            key = makeid(8);
            console.log("key", key);
            databaseResponse = await trx("users").select("*").where({ key });
            loop = databaseResponse.length == 0 ? false : true;
          }

          errors.key = key;
          databaseQuerys.push(
            trx("users").insert({
              nome,
              matricula,
              userID,
              tipo: userType,
              key,
              campus,
              password: md5(key as string),
            })
          );

          if (tipo == "ALU") {
            databaseQuerys.push(trx("alunos").insert({ userID, curso }));
          } else if (["PRO", "MON"].includes(tipo)) {
            databaseQuerys.push(trx(userType).insert({ userID, departamento }));
          }

          create = (await databaseCommit(databaseQuerys)) ? true : false;
        }
      }
      await trx.commit();
      return res.json({ create, ...errors });
    } catch (error) {
      await trx.rollback();
      console.log(error);
      res.status(500);
      return res.send(error);
    }
  }
}
