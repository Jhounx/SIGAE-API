import { Router } from "express";

import { dev } from "./routes/dev";
import { info } from "./routes/information";

import user from './routes/User'
import * as jwt from './setup/jwt'

import {
    needAdmin,
    needLogin,
} from "./setup/permissions";

const rota = Router();

rota.get("/loged", needLogin);
rota.get("/login", user.login.logar);

rota.post("/createBasic", needAdmin, user.register.createBasicUser);
rota.post("/regist", user.register.registFull);

rota.post("/setInfo", needLogin, user.set.userInformations);

rota.get("/allTurmas", info.allTurmas);
rota.get("/possibleName", needLogin, info.possibilyNames);




//dev Routes
rota.get("/inc", dev.increment);
rota.get("/showUsers", dev.showAll);
rota.post("/sendMail", dev.testMail);
rota.get("/testToken", (req, res)=>{
    try {
        return res.json(jwt.getDataToken(req))
    } catch (error) {
        return res.status(401).send({status: error})
    }
})

export default rota;
