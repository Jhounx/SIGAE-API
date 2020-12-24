import mail from 'nodemailer'
import email from '../json/email.json'


interface inputMail {
   to: string;
   subject: string;
   text: string;
}

export default function(mailConf: inputMail){
   const remetente = mail.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
         user: email.Adress,
         pass: email.Password
      }
   })

   console.log(remetente.sendMail({from: email.Adress, ...mailConf}, (error)=>{
      console.log(error)
   }))

   
}
