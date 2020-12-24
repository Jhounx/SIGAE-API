import { preferenceName } from "../utils/strings";
import cursos from "../json/Cursos.json";
import turmasCampus from '../json/Turmas_C.json'
import todasMaterias from "../json/materias.json";
import Knex from 'knex'


export default {
  email: async (email: string, trx: Knex.Transaction<any, any>) => {
    const emailRegex = /^[a-z0-9]{3,64}@[a-z0-9]{3,30}[.]{1,1}.+[a-z0-9]{1,20}$/i;
    const databaseResponse = await trx("users")
      .where({ email })
      .select("*")
      
    return (
      emailRegex.test(email) && databaseResponse && databaseResponse.length == 0
    );
  },

  turma: (turma: string, curso: string, campus: string) => {
    //@ts-ignore
    return turmasCampus[campus][curso].includes(turma)
  },

  nomePreferencia: (nome: string, fullName: string) => {
    return preferenceName(fullName).includes(nome);
  },
  senha: (senha: string) => {
    const senhaRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    return senhaRegex.test(senha);
  },
  curso: (curso: string) => {
    return Object.keys(cursos).includes(curso);
  },
  campus: (campus: string) => {
     return Object.keys(turmasCampus).includes(campus)
  }, 
  materias: (materias: any[], campus: string) =>{
    if(typeof materias == typeof []) {
      for (let materia of materias) {
        if(!Object.keys(todasMaterias).includes(materia)) return false
      }
      return true
    } else return false
  },
  departamento: (departamento: string) => {
    return Object.keys(todasMaterias).includes(departamento)
  }
};

//UJ3B8QYA
