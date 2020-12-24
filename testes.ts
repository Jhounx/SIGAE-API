import database from "./src/database/connection";
import md5 from "md5";
import {uuid} from 'uuidv4'

(async () => {
  const insert = {
    userID: uuid(),
    matricula: "20190058027",
    password: md5("batata"),
    nome: "Joao Costa dos Santos Neto",
    tipo: "admins",
    key: "KLNSDSFAOWE13"
  };
  const response = await database("users").insert(insert);
  console.log(response)
})();
