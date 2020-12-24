import { Response, Request } from "express";
import database from "../../database/connection";
import * as jwt from '../../setup/jwt'
import md5 from "md5";

export default class {

  static async logar(req: Request, res: Response) {
    try {
			//@ts-ignore
			const [, hash] = req.headers.authorization.split(" ");
    	const [login, password] = Buffer.from(hash, "base64").toString().split(":");
      let sign = false;
      const token = <{token ?: string}>{}

      if (login && password) {
				console.log(login, password)
        const databaseResponse = await database("users")
          .select("userID", "nome", "tipo")
          .where({ matricula: login, password: md5(password) });

        if (databaseResponse.length == 1) {
					const user = databaseResponse[0];
					delete user.password
					
          token.token = jwt.sign(user)
         	sign = true;
        }
      }

      return res.json({ sign, ...token });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
