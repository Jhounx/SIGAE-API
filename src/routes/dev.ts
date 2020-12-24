import {Response, Request} from 'express'
import database from '../database/connection'
import {makeid} from '../utils/strings'
import md5 from 'md5'
import sendMail from '../utils/sendMail'

export class dev {
   static async increment(req: Request, res: Response) {
      await database('alunos').insert({
         userID: makeid(10),
         matricula: '20190058027',
         password: md5('joao'),
         email: 'joaocosta_neto@hotmail.com',
         fullName: 'João Costa dos Santos Neto',
         nomePreferencia: 'João Costa',
      })

      return res.send("ok")
   }

   static async showAll(req: Request, res: Response) {
      const responseDatabase = await database.select('*').from('users')
      return res.json(responseDatabase)
   }

   static async testMail(req: Request, res: Response) {
      const {to, subject, text} = req.body
      sendMail({to, subject, text})
      res.send('oi')
   }
}